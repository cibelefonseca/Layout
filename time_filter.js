//Create window
const frame_time_filter = jsFrame.create({
    title: 'Time Filter',
    left: 20, top: 20, width: 240, height: 240,
    movable: true,//Enable to be moved by mouse
    resizable: true,//Enable to be resized by mouse
    html: `<div id="time_filter_div" style="padding:10px;font-size:12px;color:darkgray;">
                <div id="view_speed">
                    <p>Enter the begin time:</p>
                    <input type="number" id="minutes_begin" min="0" step="1" value="00">:
                    <input type="number" id="seconds_begin" min="0" max="59" step="1" value="00">
                    <p>Enter the end time:</p>
                    <input type="number" id="minutes_end" min="0" step="1" value="00">:
                    <input type="number" id="seconds_end" min="0" max="59" step="1" value="01">
                    <p>Show the period of time:</p>
                    <button id="time_filter">Show</button>
                    <button id="clear_time">Clear</button>
                </div>
            </div>`
})

//frame_time_filter.show()

function timeFilter(data){
    d3.select('#time_filter').on('click', function(){
        
            var minutes_begin = frame_time_filter.$('#minutes_begin').value
            var seconds_begin = frame_time_filter.$('#seconds_begin').value
            var minutes_end = frame_time_filter.$('#minutes_end').value
            var seconds_end = frame_time_filter.$('#seconds_end').value
            var total_seconds_begin = minutes_begin * 60 + seconds_begin
            var total_seconds_end = minutes_end * 60 + seconds_end
            var frames_begin = total_seconds_begin * 30 //fps
            var frames_end = total_seconds_end * 30
            var new_data = []
            for (var i in data){
                //console.log(data[i])
                var new_trajectory = []
                for (var j in data[i].trajectory){
                    //console.log(data[i].trajectory[j].frame, frames_begin, frames_end)
                    if(data[i].trajectory[j].frame >= frames_begin && data[i].trajectory[j].frame <= frames_end){
                        new_trajectory.push(data[i].trajectory[j])
                    }
                }
                new_data.push({label: data[i].label, trajectory: new_trajectory})
            }
            console.log(new_data)
            items1 = new_data
            var time_bars = createTimeBarsInputArray(new_data)
            console.log(time_bars)
            d3.select('#chart').select('svg').remove()
            showAllMeetings(time_bars)
            showMeetings(time_bars)
            showSpeed(time_bars)
            sortSelectorActionOnFrame(time_bars)
            generateTimeFilter(time_bars, total_seconds_begin, total_seconds_end)
        })
    
    d3.select('#clear_time').on('click', function(){
        d3.json(`${files_path}detections.json`).then(function(data){
            console.log(data)
            items = data
            var time_bars = createTimeBarsInputArray(data)
            console.log(time_bars)
            d3.select('#chart').select('svg').remove()
            showAllMeetings(time_bars)
            showMeetings(time_bars)
            showSpeed(time_bars)
            sortSelectorActionOnFrame(time_bars)
            generate(time_bars)
        })
    })
}

function generateTimeFilter(data, begin, end){
    labels = uniqueLabels(data)
    finish = []
    start = []
    fps = 30
    for (i in data){
        finish.push(data[i].finish)
        start.push(data[i].start)
    }
    var chart_height = labels.length*15 + 25

    // Create svg
    var svg = d3.select('#chart')
        .append('svg')
        .attr('width', chart_width)
        .attr('height', chart_height)

    // Create a group for temporal visualization
    var temporal_visualization = svg.append('g')
        .attr('class', 'temporal-visualization')
        .attr('width', chart_width)
        .attr('height', chart_height)

    // Create Scales
    var x_scale = d3.scaleLinear()
        .domain([
            begin*fps, end*fps
        ])
        //.range([y_padding+x_padding, chart_width - x_padding*2 - y_padding])
        .range([y_padding+x_padding, chart_width - x_padding])

    var y_scale = d3.scaleBand()
        .domain(d3.range(labels.length))
        //.rangeRound([0, chart_height - y_padding])
        .rangeRound([0, 15*labels.length])
        .paddingInner(0.3)
        
    // Create Axis
    var x_axis = d3.axisBottom(x_scale)
        .ticks(fps)
        .tickFormat(function(d){
            var res = (d/fps) 
            return res.toFixed(2) + 's'
        })
    temporal_visualization.append('g')
        .attr('class', 'x-axis')
        .attr(
            'transform',
            'translate(0, ' + (chart_height - x_padding) + ')'
        )
        .call(x_axis)
    
            
    var y_axis = d3.axisLeft(y_scale)
        .tickFormat(function(d){
            yaxis = document.getElementsByClassName('y-axis')//.selectAll('div').append('div').attr('id', 'div-'+labels[d])
            //console.log(yaxis)
            return labels[d]
        })

    temporal_visualization.append('g')
        .attr('class', 'y-axis')
        .attr(
            'transform',
            'translate(' + y_padding + ',0)'
        )
        .call(y_axis)

    //Foreign Object
    temporal_visualization.select('.y-axis')
        .selectAll('g')
        .append('foreignObject')
        //.attr("width", y_scale.bandwidth()*1.5)
        //.attr("height", y_scale.bandwidth()*1.5)
        .attr("width", 20)
        .attr("height", 20)
        .attr(
            'transform',
            `translate(${-y_padding},${-y_scale.bandwidth()})`
        )
        .html(function(d) {
            //console.log(labels[d])
            //return `<form width=${y_scale.bandwidth()*1.5} height=${y_scale.bandwidth()*1.5}><input type=checkbox id=${labels[d]} class=label-checkbox/></form>`;
            return `<input type=checkbox width=12 height=12 id=${labels[d]} class=label-checkbox/>`;
        })
        
    // Adiciona interação quando clica no label 
    temporal_visualization.select('.y-axis')
        .selectAll('text')
        .on('click', function(d){
            objects_bars_id = '#objects_bars'
            class_name = temporal_visualization.select(objects_bars_id).select('#'+labels[d]+'_bars').attr('class')
            // Verifica se todas as barras estão visíveis, se estiverem, apenas a barra em que clicou ficará visível
            var just_one_visible = true
            var classes = []
            for (var i in labels){
                classes.push(temporal_visualization.select(objects_bars_id).select('#'+labels[i]+'_bars').attr('class'))
                if (classes[i] == 'bars-invisible'){
                    just_one_visible = false
                    break
                }
            }
            //console.log(classes)
            //console.log(just_one_visible)
            if(just_one_visible == false){
                temporal_visualization.select(objects_bars_id)
                .select('#'+labels[d]+'_bars')
                .attr('class', function(){
                    if (class_name != 'bars-invisible'){
                        return 'bars-invisible'
                    }
                    else{
                        return 'bars-visible'
                    }
                })
                // meetings_bars
                var verify = d3.select('#' +labels[d] + '_meetings_bars')
                // If exists the group in the meetings_bars for this object
                // Erro: não muda a opacidade se os encontros do objeto estiver dentro de outro
                if(verify._groups[0][0] != null){
                    var meetings_class_name = d3.select('#'+labels[d]+'_meetings_bars').attr('class')
                    d3.select('#'+labels[d]+'_meetings_bars').attr('class', function(){
                            if (meetings_class_name != 'bars-invisible'){
                                return 'bars-invisible'
                            }
                            else{
                                return 'bars-visible'
                            }
                        })
                }
                // allmeetings_bars
                var verify = d3.select('#'+labels[d]+'_allmeetings_bars')
                // If exists the group allmeetings_bars for this object
                if(verify._groups[0][0] != null){
                    allmeetings_class_name = d3.select('#'+labels[d]+'_allmeetings_bars').attr('class')
                    d3.select('#'+labels[d]+'_allmeetings_bars')
                        .attr('class', function(){
                            if (allmeetings_class_name != 'bars-invisible'){
                                return 'bars-invisible'
                            }
                            else{
                                return 'bars-visible'
                            }
                        })
                }
                // speed_bars
                verify = d3.select('#speed_bars')
                // If exists the group speed_bars
                if(verify._groups[0][0] != null){
                    speed_class_name = d3.select('#'+labels[d]+'_speed_bars').attr('class')
                    d3.select('#'+labels[d]+'_speed_bars')
                        .attr('class', function(){
                            if (speed_class_name != 'bars-invisible'){
                                return 'bars-invisible'
                            }
                            else{
                                return 'bars-visible'
                            }
                        })
                }
            // First to click
            } else {
                temporal_visualization.select(objects_bars_id).selectAll('g').attr('class', 'bars-invisible')
                temporal_visualization.select(objects_bars_id).select('#'+labels[d]+'_bars').attr('class', 'bars-visible')
                // meetings_bars
                var verify = d3.select('#meetings_bars')
                if(verify._groups[0][0] != null){
                    var verify1 = d3.select('#'+labels[d]+'_meetings_bars')
                    console.log('#' + labels[d] + '_meetings_bars')
                    d3.select('#meetings_bars').selectAll('g').selectAll('g').attr('class', 'bars-invisible')
                    if (verify1._groups[0][0] != null){
                        //console.log(verify1._groups[0][0].parentElement.id) // id do pai do verigy1
                        d3.select('#'+labels[d]+'_meetings_bars').attr('class', 'bars-visible')
                    }
                    
                }
                // allmeetings_bars
                var verify = d3.select('#allmeetings_bars')
                // If exists the group allmeetings_bars
                if(verify._groups[0][0] != null){
                    d3.select('#allmeetings_bars').selectAll('g').attr('class', 'bars-invisible')
                    d3.select('#allmeetings_bars').select('#'+labels[d]+'_allmeetings_bars').attr('class', 'bars-visible')
                }
                //speed_bars
                verify = d3.select('#speed_bars')
                // If exists the group speed_bars
                if(verify._groups[0][0] != null){
                    d3.select('#speed_bars').selectAll('g').attr('class', 'bars-invisible')
                    d3.select('#speed_bars').select('#'+labels[d]+'_speed_bars').attr('class', 'bars-visible')
                }
            }
            
        })

    // Create a group for all bars
    temporal_visualization.append('g')
            .attr('class', 'bars')
            .attr('id', 'bars')
    // Select the bars group
    bars = temporal_visualization.select('.bars')
    var objects_bars = bars.append('g')
                            .attr('id', 'objects_bars')
                            .style('opacity', 0.7)

    //Group the bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
                    .key(function(d){return d.label})
                    .entries(data)
    //console.log(nested_data); 

    // Bind Data and Create Bars
    objects_bars = objects_bars.selectAll('rect')
                .data(nested_data)
                .enter()
                .append('g')
                .attr('id', function(d){
                    return d.key + '_bars'
                })
                .attr('class','bars-visible')
    objects_bars.selectAll('rect').append('rect')
                .data(function(d){
                    return d.values
                })
                .enter()
                .append('rect')
                .attr('x', function(d){
                    return x_scale(d.start)
                })
                .attr('y', function(d){
                    return y_scale(labels.indexOf(d.label))
                })
                .attr('width', function(d){
                    return x_scale(d.finish) - x_scale(d.start)
                })
                .attr('height', y_scale.bandwidth())
                .attr('fill', '#808080')
                .attr('stroke', '#808080')
                .attr('stroke-width', '1px')
                .on('mouseover', function(d){
                    var mouse_x = event.clientX
                    var bar_y = parseFloat(d3.select(this).attr('y')) +
                                y_scale.bandwidth() * 2.5
                                //y_scale.bandwidth() / 2
                    //console.log(bar_y)
                    d3.select('#tooltip')
                        .style('left', mouse_x + "px")
                        .style('top', bar_y + "px")
                        .style('display', 'block')
                        .text(d.label)
                        .style( 'color', '#808080')
                })
                .on('mouseout', function(){
                    d3.select('#tooltip')
                        .style('display', 'none')
                })
}