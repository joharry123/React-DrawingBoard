class DrawingBoard {
    MODE = "NONE";
    IsMouseDown = false;
    eraserColor = "#FFFFFF";
    backgroundColor = "#FFFFFF";
    IsNavigatorVisible = false;
    undoArray = [];
    containerEl;
    canvasEl;
    toolbarEl;
    brushEl;
    colorPickerEl;
    brushPanelEl;
    brushSliderEl;
    brushSizePreviewEl;
    eraserEl;
    navigatorEl;
    navigatorImageContainerEl;
    navigatorImageEl;
    undoEl;
    clearEl;
    downloadLinkEl;
    constructor(){
        this.assingElement();
        this.initContext();
        this.initCanvasBackgroundColor();
        this.addEvent();
    }
    assingElement() {
        this.containerEl = document.getElementById("container");
        this.canvasEl = this.containerEl.querySelector("#canvas");
        this.toolbarEl = this.containerEl.querySelector("#toolbar");
        this.brushEl = this.toolbarEl.querySelector("#brush");
        this.colorPickerEl = this.toolbarEl.querySelector("#colorPicker");
        this.brushPanelEl = this.containerEl.querySelector("#brushPanel");
        this.brushSliderEl = this.brushPanelEl.querySelector("#brushSize");
        this.brushSizePreviewEl = this.brushPanelEl.querySelector("#brushSizePreview");
        this.eraserEl = this.toolbarEl.querySelector("#eraser");
        this.navigatorEl = this.toolbarEl.querySelector("#navigator");
        this.navigatorImageContainerEl = this.containerEl.querySelector("#imgNav");
        this.navigatorImageEl = this.navigatorImageContainerEl.querySelector("#canvasImg");
        this.undoEl = this.toolbarEl.querySelector("#undo");
        this.clearEl = this.toolbarEl.querySelector("#clear");
        this.downloadLinkEl = this.toolbarEl.querySelector("#download");
    }
    initContext() {
        this.context = this.canvasEl.getContext("2d");
    }
    initCanvasBackgroundColor() {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    }
    addEvent() {
        this.brushEl.addEventListener("click", this.onClickBrush.bind(this));
        this.canvasEl.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvasEl.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.canvasEl.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvasEl.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.navigatorEl.addEventListener("click", this.onClickNavigator.bind(this));
        this.brushSliderEl.addEventListener("input", this.onChangeBrushSize.bind(this));
        this.colorPickerEl.addEventListener("input", this.onChangeColor.bind(this));
        this.eraserEl.addEventListener("click", this.onEraser.bind(this));
        this.clearEl.addEventListener("click", this.onClear.bind(this));
        this.downloadLinkEl.addEventListener("click", this.onDownload.bind(this));
        this.undoEl.addEventListener("click", this.onUndo.bind(this));
    }
    onClickBrush(event) {
        console.log("brushclickEvent");
        const IsActive = event.currentTarget.classList.contains("active");
        //active상태인지 확인하는 변수 
        this.MODE = IsActive ? "NONE" : "BRUSH";
        //active상태라면 none, 아니면 bursh 모드로 변경 
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        this.brushPanelEl.classList.remove("hide");
        event.currentTarget.classList.toggle("active");
        if (IsActive) this.brushPanelEl.classList.toggle("hide");
        this.eraserEl.classList.remove("active");
    }
    onMouseDown(event) {
        this.IsMouseDown = true;
        console.log("그리기시작");
        const currentPosition = this.getMousePosition(event);
        //어디서 마우스를 내려놨나 
        this.context.beginPath();
        this.context.moveTo(currentPosition.x, currentPosition.y);
        this.context.lineCap = "round";
        if (this.MODE === "BRUSH") {
            this.context.strokeStyle = this.colorPickerEl.value;
            this.context.lineWidth = this.brushSliderEl.value;
        } else if (this.MODE === "ERASER") {
            this.context.strokeStyle = this.eraserColor;
            this.context.lineWidth = this.brushSliderEl.value;
        }
        this.saveState();
    }
    onClickNavigator(event) {
        this.IsNavigatorVisible = !event.currentTarget.classList.contains("active");
        //클릭된 상태가 false, ! 때문에 ture 가 됨 
        event.currentTarget.classList.toggle("active");
        this.navigatorImageContainerEl.classList.toggle("hide");
        this.updateNavigator();
    }
    updateNavigator() {
        if (!this.IsNavigatorVisible) return;
        this.navigatorImageEl.src = this.canvasEl.toDataURL();
        console.log("navUpdate");
    //img를 표현하는 법, png,jpg --> 파일, dataurl로 보여주는 방법 
    //url을 src에 넣어주면 이미지를 그려주게 됨 
    }
    getMousePosition(event) {
        const boundaries = this.canvasEl.getBoundingClientRect();
        return {
            x: event.clientX - boundaries.left,
            y: event.clientY - boundaries.top
        };
    }
    onChangeColor(event) {
        this.brushSizePreviewEl.style.background = event.target.value;
    }
    onChangeBrushSize(event) {
        this.brushSizePreviewEl.style.width = `${event.target.value}px`;
        this.brushSizePreviewEl.style.height = `${event.target.value}px`;
    }
    onMouseMove(event) {
        if (!this.IsMouseDown) return;
        const currentPosition = this.getMousePosition(event);
        this.context.lineTo(currentPosition.x, currentPosition.y);
        this.context.stroke();
    }
    onMouseUp(event) {
        this.IsMouseDown = false;
        this.updateNavigator();
    }
    onMouseOut() {
        if (this.MODE === "NONE") return;
        this.IsMouseDown = false;
        this.updateNavigator();
    }
    onEraser(event) {
        const IsActive = event.currentTarget.classList.contains("active");
        this.MODE = IsActive ? "NONE" : "ERASER";
        this.canvasEl.style.cursor = IsActive ? "default" : "crosshair";
        event.currentTarget.classList.toggle("active");
        this.brushPanelEl.classList.remove("hide");
        // this.brushPanelEl.classList.add("hide");  
        this.brushEl.classList.remove("active");
        if (IsActive) this.brushPanelEl.classList.toggle("hide");
        this.context.lineWidth = this.brushSliderEl.value;
    }
    onClear() {
        alert("clear");
        if (this.navigatorEl.classList.contains("active")) {
            this.navigatorEl.classList.remove("active");
            this.navigatorImageContainerEl.classList.add("hide");
        }
        this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
        this.initCanvasBackgroundColor();
    }
    onDownload() {
        console.log("다운로드");
        this.downloadLinkEl.href = this.canvasEl.toDataURL("image/jpeg", 1);
        this.downloadLinkEl.download = "exmaple.jpeg";
    }
    saveState() {
        if (this.undoArray.length > 4) {
            this.undoArray.shift(); //젤 앞에있는 것 삭제하고
            this.undoArray.push(this.canvasEl.toDataURL()); //넣어준다
        } else this.undoArray.push(this.canvasEl.toDataURL());
    }
    onUndo() {
        console.log("실행취소");
        if (this.undoArray.length === 0) alert("더이상은 실행취소가 불가능합니다");
        let previousDataUrl = this.undoArray.pop();
        let previousImage = new Image();
        previousImage.onload = ()=>{
            this.context.clearRect(0, 0, this.context.width, this.context.height);
            this.context.drawImage(previousImage, 0, 0, this.canvasEl.width, this.canvasEl.height, 0, 0, this.canvasEl.width, this.canvasEl.height);
        };
        previousImage.src = previousDataUrl;
    }
}
new DrawingBoard();

//# sourceMappingURL=index.b1397192.js.map
