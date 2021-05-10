const files_path = '/video_files/Meet_Crowd/'

// Data from JSON files
var info = {}
var ratio = 1
$.getJSON( `${files_path}video_infos.json`, function( data ) {
    info = data
    ratio = calculateRatio()
})
var detections = []
$.getJSON( `${files_path}detections.json`, function( data ) {
    detections = data
})
var time_bars = []
var labels_colors = []
var const_labels = []
$.getJSON( `${files_path}time_bars_input.json`, function( data ) {
    time_bars = data
    labels_colors = labelsColors(uniqueLabels(data))
    const_labels = uniqueLabels(data)
})
d3.json(`${files_path}time_bars_input.json`).then(function(data){
    $.getJSON( `${files_path}detections.json`, function( detdata ) {
        detections = detdata
        generate(data, detections)
    })
    //generate(data)
    showJSFrame(data)
    //testData(uniqueLabels(data))
})