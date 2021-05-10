var fps = 0
var frames_total = 0

function createTimeBarsInput(file_name){
    d3.json(file_name).then(function(data){
        //console.log(data)
        var time_bars = []
        for (var i = 0; i < data.length; i++){
            //console.log(data[i])
            var vstart = -1
            var vfinish = -1
            var finish_aux = -1
            for (var j = 0; j < data[i].trajectory.length; j++){
                if (vstart == -1){
                    vstart = data[i].trajectory[j].frame
                    vfinish = data[i].trajectory[j].frame
                    finish_aux = data[i].trajectory[j].frame
                } else if(data[i].trajectory[j].frame != vfinish+1){
                    time_bars.push({label: data[i].label, start: vstart, finish: vfinish, meeting: 0})
                    finish_aux = vfinish
                    vstart = data[i].trajectory[j].frame
                    vfinish = data[i].trajectory[j].frame
                } else{
                    vfinish = data[i].trajectory[j].frame
                }
            }
            if (vfinish != finish_aux){
                time_bars.push({label: data[i].label, start: vstart, finish: vfinish, meeting: 0})
            }
        }
        console.log(time_bars)
    })
}

//createTimeBarsInput('detections.json')

function createTimeBarsInputArray(detections_array){
    var data = detections_array
    var time_bars = []
    for (var i = 0; i < data.length; i++){
        //console.log(data[i])
        var vstart = -1
        var vfinish = -1
        var finish_aux = -1
        for (var j = 0; j < data[i].trajectory.length; j++){
            if (vstart == -1){
                vstart = data[i].trajectory[j].frame
                vfinish = data[i].trajectory[j].frame
                finish_aux = data[i].trajectory[j].frame
            } else if(data[i].trajectory[j].frame != vfinish+1){
                time_bars.push({label: data[i].label, start: vstart, finish: vfinish, meeting: 0})
                finish_aux = vfinish
                vstart = data[i].trajectory[j].frame
                vfinish = data[i].trajectory[j].frame
            } else{
                vfinish = data[i].trajectory[j].frame
            }
        }
        if (vfinish != finish_aux){
            time_bars.push({label: data[i].label, start: vstart, finish: vfinish, meeting: 0})
        }
    }
    //console.log(time_bars)
    return time_bars
}