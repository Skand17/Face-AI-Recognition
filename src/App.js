import React, { PureComponent } from 'react'
import * as faceapi from 'face-api.js';

const MODEL_URL = './models'

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state  = {
        status : []
    }
  }



  componentDidMount(){     

    var video = document.querySelector("video");
        // Promose
    Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    
  ]).then( (openWebcam))

  function openWebcam(){
    var constraints = { audio: true, video: { width: 720, height: 560 } };
    navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
        video.srcObject = mediaStream;
      }).catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); 
  }

  video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas) 
        const displaySize = {
            width : video.width, height: video.height
        }
        setInterval( async ()=> {
              const detections =  await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
              this.setState({
                status :detections
              })
              const resizeDetection =  faceapi.resizeResults(detections, displaySize)
              this.setState({
                status : resizeDetection
              })
              canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
               faceapi.draw.drawDetections(canvas,resizeDetection)
               faceapi.draw.drawFaceExpressions(canvas,resizeDetection)
               faceapi.draw.drawFaceLandmarks(canvas,resizeDetection)

          },900)
        })
  }
      
  

  render() {
    return (
      <div>
          <video  width="720" height="420" autoPlay muted></video>  
          <div>
          </div>
      </div>
    )
  }
}

export default App