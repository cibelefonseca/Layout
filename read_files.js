const fileBodyContent = document.querySelector("#listener");

const files_path = '/video_files/Meet_Crowd/'

const serverBaseURL = 'http://127.0.0.1:5501'

document.addEventListener('DOMContentLoaded',() => {
    getDetectionContent()
});

let info = {}
let ratio = 1

let detections = []

let time_bars = []
let labels_colors = []
let const_labels = []

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
  
const getDetectionContent = async () => {
    try {
        const response = await fetch(`${serverBaseURL}/uploadFiles/text.json`);
        const responseData = await response.json();
        const timeBar =  handleTimeBarsInput(responseData)

        //set Time bar
        time_bars = timeBar
        labels_colors = labelsColors(uniqueLabels(timeBar))
        const_labels = uniqueLabels(timeBar)

        //set Detections
        generate(timeBar, responseData)
        showJSFrame(timeBar)

        // var shell = CreateObject("WScript.Shell");
        // shell.Run("python main.py");

    } catch (error) {
        console.error(error)
    }
}

$.getJSON( `${files_path}video_infos.json`, function( data ) {
    info = data
    ratio = calculateRatio()
})

// $.getJSON( `${files_path}detections.json`, function( data ) {
//     console.log("detections.json - detections", data)
//     detections = data
// })

// $.getJSON( `${files_path}time_bars_input.json`, function( data ) {
//     time_bars = data
//     labels_colors = labelsColors(uniqueLabels(data))
//     const_labels = uniqueLabels(data)
// })

// d3.json(`${files_path}time_bars_input.json`).then(function(data) {
//     $.getJSON( `${files_path}detections.json`, function( detdata ) {
//         detections = detdata
        
//         // console.log('detections ->', detections)
//         // console.log('data ->', data)

//         generate(data, detections)
//     })
//     showJSFrame(data)
// })
