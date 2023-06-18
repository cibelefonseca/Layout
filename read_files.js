const fileBodyContent = document.querySelector("#listener");
const files_path = 'http://localhost:8080/tcc/src/modules/videoProcess/uploadFiles/'

const x = "http://http://localhost:8080/objects-behavior-visual-analysis-system/?file1=http://localhost:8080/tcc/src/modules/videoProcess/uploadFiles/detections.json&file2=http://localhost:8080/tcc/src/modules/videoProcess/uploadFiles/video.mp4&"

let info = {}
let ratio = 1
let detections = []
let time_bars = []
let labels_colors = []
let const_labels = []

function splitString(str) {
    const result = str.split('&').map(item => item.replace('file1=', '').replace('file2=', ''));
    result[0] = result[0].replace('http://127.0.0.1:5501/index.html?', '');
  
    return result;
}

const receivedCurrentPath = window.location.href == "http://localhost:8080/objects-behavior-visual-analysis-system/"? splitString(x) : splitString(window.location.href)

const getDetectionContent = async () => {
    try {
   
        const detectionsResponse = await fetch('http://localhost:8080/tcc/src/modules/videoProcess/uploadFiles/detections.json');
        const detectionsResponseData = await detectionsResponse.json();
        
        const videoInfo = await getVideoInfo()
        console.log(videoInfo)

        const timeBar =  handleTimeBarsInput(detectionsResponseData)

        //set Time bar
        time_bars = timeBar
        labels_colors = labelsColors(uniqueLabels(timeBar))
        const_labels = uniqueLabels(timeBar)

        //set Detections
        detections = detectionsResponseData
        generate(timeBar, detectionsResponseData)
        showJSFrame(timeBar)

    } catch (error) {
        console.error(error)
    }
}

const handleTimeBarsInput = (object) => {
    const timeBarsInputData = []
    object.map(element => {
        timeBarsInputData.push({ 
            "label" : element.label, 
            "start" : element.trajectory[0].frame, 
            "finish": element.trajectory.at(-1).frame,
            "meeting" : 0
        })
    })

    return timeBarsInputData   
}

const getVideoInfo = async () => {
    try {
      const response = await fetch('http://localhost:3000/run-python');
      await response.text()
      
      if (!response.ok) {
        throw new Error('Erro ao executar o arquivo Python.');
      }
  
    } catch (error) {
      console.error(error);
    }
  };

$.getJSON( `${files_path}/video_infos.json`, function( data ) {
    info = data
    ratio = calculateRatio()
})

document.addEventListener('DOMContentLoaded',() => {
    getDetectionContent()
});