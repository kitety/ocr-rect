import { useMount, useReactive, useSize } from "ahooks";
import { useEffect, useRef } from "react";
import "./index.less";
import v from "../assets/1.mp4";
export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rectRef = useRef<HTMLDivElement>(null);
  const state = useReactive({
    btnShow: false,
    reactShow: false,
    switch: false,
  });

  const size = useSize(videoRef);
  const positionRef = useRef({
    top: 0,
    left: 0,
  });
  const startPosition = useRef({
    x: 0,
    y: 0,
  });
  const endPosition = useRef({
    x: 0,
    y: 0,
  });
  const moveRef = useRef({
    mouseDown: false,
  });

  const play = () => {
    videoRef.current?.play();
  };
  const pause = () => {
    videoRef.current?.pause();
  };
  useEffect(() => {
    if (videoRef.current && size) {
      // canvasRef.current.width = size.width!;
      // canvasRef.current.height = size.height!;
      const positionObj = videoRef.current.getBoundingClientRect();

      positionRef.current = {
        top: positionObj.top,
        left: positionObj.left,
      };
    }
  }, [size]);
  const mouseDown = (event: React.MouseEvent) => {
    if (!state.switch) {
      return;
    }
    pause();
    console.log("mouseDown");
    const { left, top } = positionRef.current;
    const { clientX, clientY } = event;
    const [x, y] = [clientX - left, clientY - top];
    console.log("mouseDown x, y: ", x, y);

    startPosition.current = { x, y };
    rectRef.current.style.left = x + "px";
    rectRef.current.style.top = y + "px";
    moveRef.current.mouseDown = true;
    endPosition.current.x = 0;
    endPosition.current.y = 0;
    if (rectRef.current) {
      const element = rectRef.current;
      element.style.width = 0 + "px";
      element.style.height = 0 + "px";
    }
  };
  const mouseUp = (event: React.MouseEvent) => {
    if (!moveRef.current.mouseDown || !state.switch) {
      return;
    }
    state.switch = false;
    console.log("mouseUp");
    moveRef.current.mouseDown = false;

    const { left, top } = positionRef.current;
    const { clientX, clientY } = event;
    const [x, y] = [clientX - left, clientY - top];
    console.log("mouseUp x, y: ", x, y);

    endPosition.current.x = x;
    endPosition.current.y = y;
    state.btnShow = true;

    // setPosition(event);
  };
  const mouseMove = (event: React.MouseEvent) => {
    if (!moveRef.current.mouseDown || !state.switch) {
      return;
    }
    console.log("mouseMove");
    setPosition(event);
  };
  const setPosition = (event: React.MouseEvent) => {
    const { left, top } = positionRef.current;
    const { clientX, clientY } = event;
    const [x, y] = [
      clientX - left - startPosition.current.x,
      clientY - top - startPosition.current.y,
    ];
    if (rectRef.current) {
      const element = rectRef.current;
      element.style.width = x + "px";
      element.style.height = y + "px";
    }
  };
  const apply = () => {
    // const cv2 = document.getElementById("cv1") as HTMLCanvasElement;
    const cv2 = document.createElement("canvas");
    cv2.width = endPosition.current.x - startPosition.current.x;
    cv2.height = endPosition.current.y - startPosition.current.y;
    // document.body.appendChild(cv2);
    const ctx2 = cv2.getContext("2d")!;
    console.log("111", [
      videoRef.current!,
      startPosition.current.x,
      startPosition.current.y,
      endPosition.current.x - startPosition.current.x,
      endPosition.current.y - startPosition.current.y,
      0,
      0,
      size.width,
      size.height,
    ]);
    ctx2.drawImage(
      videoRef.current!,
      startPosition.current.x,
      startPosition.current.y,
      endPosition.current.x - startPosition.current.x,
      endPosition.current.y - startPosition.current.y
    );
    const dataURI = cv2.toDataURL("image/jpeg");
    console.log("dataURI: ", dataURI);
    const img = document.createElement("img");
    img.src = dataURI;
    img.style.paddingTop = "480px";
    img.style.width = "430px";
    document.body.appendChild(img);
    state.switch = false;
    return;
    // let canvas = document.createElement("canvas");
    // let ctx = canvas.getContext("2d");
    // canvas.width = videoRef.current.videoWidth;
    // canvas.height = videoRef.current.videoHeight;
    // let img = document.createElement("img");
    // ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    // console.log('canvas.toDataURL("image/png")', canvas.toDataURL("image/png"));
  };
  const rect = () => {
    pause();
    state.reactShow = true;
    state.btnShow = false;
    state.switch = true;
  };
  const close = () => {
    state.reactShow = false;
    state.btnShow = false;
    play();
    state.switch = false;
  };
  return (
    <div>
      <div>
        <div>
          <button onClick={play}>播放</button>
          <button onClick={pause}>暂停</button>
          <button onClick={rect}>文字识别</button>
        </div>
        <div
          className='con'
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
          onMouseMove={mouseMove}
        >
          <video
            crossOrigin='anonymous'
            src='https://qhstaticva-cos.kujiale.com/media/yun/help/college/1673851609570_%E7%BE%8A%E7%BE%94%E7%BB%92%E6%95%99%E7%A8%8B-final3.mp4'
            ref={videoRef}
            className='canvas'
          ></video>
          <div
            className='rect'
            ref={rectRef}
            style={{ display: state.reactShow ? "" : "none" }}
          >
            {state.btnShow && (
              <>
                <div className='btn'>
                  <div onClick={apply}>识别</div>
                  <div onClick={close}>关闭</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
