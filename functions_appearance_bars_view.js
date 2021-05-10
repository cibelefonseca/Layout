function labelsColors(labels){
    var values = []
    const vratio = 1/labels.length
    for (i in labels){
        //console.log(`${Number(i)+1} x ${vratio}`)
        values.push((Number(i)+1) * vratio)
    }
    var colors = []
    for (i in values){
        colors.push(d3.interpolateRainbow(values[i]))
    }
    return colors
}

//Scales
function createXScale(start, finish){
    return d3.scaleLinear()
                .domain([
                    start, finish
                ])
                .range([y_padding+3, chart_width - x_padding])
                //console.log([y_padding, chart_width-x_padding])
}
function createYScale(labels){
    return d3.scaleBand()
                .domain(d3.range(labels.length))
                .rangeRound([0, 15*labels.length])
                //.rangeRound([0, chart_height - y_padding])
                .paddingInner(0.3)
}
function createXScaleInverse(start, finish){
    return d3.scaleLinear()
                .domain([
                    y_padding, chart_width - x_padding
                ])
                .range([start, finish])
}

// Image Ratio
function calculateRatio(){
    var max_width = 390
    var max_height = 200
    var ratio = 1;
    if (info.width > max_width) {
        ratio = max_width / info.width;
    }
    if (ratio * info.height > max_height) {
        ratio = max_height / info.height;
    }
    return ratio
}

// Chart
const chart_width = 1200
const x_padding = 20
const y_padding = 130
const bars_height = 11
const marker_width = 3

function uniqueLabels(data){
    var labels = []
    for (var i in data){
        if (!labels.includes(data[i].label)){
            labels.push(data[i].label)
        }
    }
    return labels
}

function ticksXAxis(res) {
    if (res/60 > 1){
        var string = "00:"
        var min = res/60
        var sec = res%60
        if (min < 10){
            string += '0' + Math.trunc(min) + ':'
        } else {
            string += Math.trunc(min) + ':'
        }
        if (sec < 10){
            string += '0' + Math.round(sec)
        } else {
            string += Math.round(sec)
        }
        return string
    } else {
        var string = '00:00:'
        if (res < 10){
            string += '0' + Math.round(res)
        } else {
            string += Math.round(res)
        }
        return string
    }
}