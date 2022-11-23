function generate(data, detections) {
    var labels = uniqueLabels(data)
     console.log('generate labels' ,labels)
    var fps = info.fps
    var chart_height = labels.length * 15 + 25

    // The height of Appearance Bars View will be a maximum of 270px 
    if (chart_height < 270) {
        d3.select('#time_bars_view').attr('height', chart_height + 'px')
    }
    else {
        d3.select('#time_bars_view').attr('height', chart_height + 'px').attr('overflow-y', 'auto')
    }

    // Create svg
    var svg = d3.select('#time_bars_view')
        .append('svg')
        .attr('width', chart_width)
        .attr('height', chart_height)

    // Create a group for temporal visualization
    var temporal_visualization = svg.append('g')
        .attr('class', 'temporal-visualization')
        .attr('id', 'temporal-visualization')
        .attr('width', chart_width)
        .attr('height', chart_height)

    // Create Scales
    var x_scale = createXScale(0, info.frames)
    var x_scale_inverse = createXScaleInverse(0, info.frames)
    var y_scale = createYScale(labels)

    // Create Axis
    //x axis
    var x_axis = d3.axisBottom(x_scale)
        //.ticks(fps)
        .ticks(5)
        .tickFormat(function (d) {
            return ticksXAxis(d / fps)
        })
    temporal_visualization.append('g')
        .attr('class', 'x-axis')
        .attr(
            'transform',
            'translate(0, ' + (chart_height - x_padding) + ')'
        )
        .call(x_axis)
    // y axis
    var y_axis = d3.axisLeft(y_scale)
        .tickFormat(function (d) {
            yaxis = document.getElementsByClassName('y-axis')//.selectAll('div').append('div').attr('id', 'div-'+labels[d])
            //console.log(yaxis)
            return labels[d]
        })
    temporal_visualization.append('g')
        .attr('class', 'y-axis')
        .attr(
            'transform',
            `translate(${y_padding}, ${15 - y_scale.bandwidth() - 1})`
        )
        .call(y_axis)

    // Add colors on labels
    d3.select('.y-axis').selectAll('.tick').select('text').style('fill', function (d) {
        //console.log(d)
        return labels_colors[const_labels.indexOf(labels[d])]
    })

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
        .html(function (d) {
            //console.log(labels[d])
            //return `<form width=${y_scale.bandwidth()*1.5} height=${y_scale.bandwidth()*1.5}><input type=checkbox id=${labels[d]} class=label-checkbox/></form>`;
            return `<input type=checkbox width=12 height=12 id=${labels[d]} class=label-checkbox />`;
        })

    // Adiciona interação quando clica no label 
    temporal_visualization.select('.y-axis')
        .selectAll('text')
        .attr('id', function(d){
            return labels[d] + '_yaxis_label'
        })
        .attr('class', 'label_not_selected')
        .on('click', function (d) {
            var class_name = d3.select('#' + labels[d] + '_yaxis_label').attr('class')
            if (class_name == 'label_not_selected') {
                d3.select('#' + labels[d] + '_yaxis_label').attr('class', 'label_selected')
            } else {
                d3.select('#' + labels[d] + '_yaxis_label').attr('class', 'label_not_selected')
            }
            var index = const_labels.indexOf(labels[d])
            showTrajectories(index, labels, detections)
            /* var object_name = prompt(`Please enter a new name for object ${labels[d]}:`, "");
            if (object_name == null || object_name == "") {
                alert(`No changes made.`)
            } else {
                alert(`Object name changed to ${object_name}.`)
            } */
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
        .key(function (d) { return d.label })
        .entries(data)
    //console.log(nested_data); 

    // Bind Data and Create Bars
    objects_bars = objects_bars.selectAll('rect')
        .data(nested_data)
        .enter()
        .append('g')
        .attr('id', function (d) {
            return d.key + '_bars'
        })
        .attr('class', 'bars-visible')
    objects_bars.selectAll('rect').append('rect')
        .data(function (d) {
            return d.values
        })
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return x_scale(d.start)
        })
        .attr('y', function (d) {
            return y_scale(labels.indexOf(d.label))
        })
        .attr('width', function (d) {
            return x_scale(d.finish) - x_scale(d.start)
        })
        //.attr('height', y_scale.bandwidth())
        .attr('height', bars_height)
        .attr('fill', '#808080')
        .attr('stroke', '#808080')
        .attr('stroke-width', '1px')
        .on('mouseover', function (d) {
            var mouse_x = event.clientX
            var bar_y = event.clientY
            var text = d.label
            var color = labels_colors[const_labels.indexOf(d.label)]
            createTooltip(mouse_x, bar_y, text, color)
        })
        .on('mouseout', function () {
            d3.select('#tooltip')
                .style('display', 'none')
        })
        .on('click', function (d) {
            var mouse_x = event.clientX
            mouse_x -= x_padding / 2
            console.log(labels)
            console.log(d)
            //var bar_y = parseFloat(d3.select(this).attr('y')) //+ y_scale.bandwidth() * 2.5
            var frame_number = Math.round(x_scale_inverse(mouse_x))
            showFrameWithBoundingBoxes(frame_number, ratio)
            showVideoPlayer(frame_number, ratio, labels, d.label, false, '')
        })
    showBrush(ratio, data)
    showFrameWithBoundingBoxes(0, ratio)
    showVideoPlayer(0, ratio, labels, '', false, '')
}

function createTooltip(left, top, text, color) {
    d3.select('#tooltip')
        .style('left', left + "px")
        .style('top', top + "px")
        .style('display', 'block')
        .text(text)
        .style('color', color)
}

function showTrajectories(index, labels, detections) {
    // Verify if there is the #object_trajectory_frame_view group, if there's not create it
    var verify = d3.select('#' + labels[index] + '_trajectory_frame_view')
    if (verify._groups[0][0] != null) {
        verify.remove()
    } else {
        var svg = d3.select('#svg_frame_view').append('g').attr('id', labels[index] + '_trajectory_frame_view')
        var trajectory_coordinates = []
        for (var i in detections[index].trajectory) {
            trajectory_coordinates.push({ x: detections[index].trajectory[i].cx, y: detections[index].trajectory[i].cy, frame: detections[index].trajectory[i].frame })
        }
        //console.log(trajectory_coordinates)
        svg.selectAll('circle').append('circle')
            .data(trajectory_coordinates)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return d.x * ratio
            })
            .attr('cy', function (d) {
                return d.y * ratio
            })
            .attr('r', '0.7px')
            .attr('fill', labels_colors[index])
            .on('mouseover', function (d) {
                var mouse_x = event.clientX
                var bar_y = event.clientY
                var text = const_labels[index] + ' ' + ticksXAxis(d.frame / info.fps)
                var color = labels_colors[index]
                createTooltip(mouse_x, bar_y, text, color)
            })
            .on('mouseout', function () {
                d3.select('#tooltip')
                    .style('display', 'none')
            })

    }
}

function addLine(labels, label, mouse_x) {
    // Verify if there is the #marker group, if there's not create it
    var verify = d3.select('#marker')
    if (verify._groups[0][0] != null) {
        verify.selectAll('line').remove()
    } else {
        d3.select('#bars').append('g').attr('id', 'marker')
    }

    // Create y_scale
    var y_scale = createYScale(labels)

    var marker = d3.select('#marker')
    marker.append('line')
        .attr('x1', mouse_x - (marker_width / 2))
        //.attr('x1', `${mouse_x}px`)
        .attr('y1', y_scale(labels.indexOf(label)))
        .attr('x2', mouse_x - (marker_width / 2))
        .attr('y2', y_scale(labels.indexOf(label)) + y_scale.bandwidth())
        .attr('stroke', 'black')
        .attr('stroke-width', '3px')
        .attr('z-index', 10)
        .on('click', function(){
            // Removes the line
            d3.select('#marker').remove()
        })
}

function showFrameWithBoundingBoxes(frame_number, ratio) {
    var labels = uniqueLabels(time_bars)
    // Add Frame Image
    var img_src = `${files_path}/frames/frame${frame_number}.png`
    d3.select('#frame_view').select('.grid-content').select('svg').remove()
    var svg = d3.select('#frame_view').select('.grid-content').append('svg')
        .attr('id', 'svg_frame_view')
        .attr('width', info.width * ratio)
        .attr('height', info.height * ratio)
    var fo = svg.append('foreignObject')
        .attr('width', info.width * ratio)
        .attr('height', info.height * ratio)
    var foBody = fo.append("xhtml:body")
        .attr('id', 'body_frame')
        .style("margin", "0px")
        .style("padding", "0px")
        .style("background-color", "none")
        .style("width", info.width * ratio + "px")
        .style("height", info.height * ratio + "px")
    foBody.append('img')
        .attr('src', img_src)
        .attr('width', info.width * ratio)
        .attr('height', info.height * ratio)

    // Get the actual frame objects coordinates
    var objects_in_frame = time_bars.filter(function (d) {
        return frame_number >= d.start && frame_number <= d.finish
    })
    //console.log(objects_in_frame)
    var detect = []
    //console.log(detections)
    for (i in objects_in_frame) {
        var detec = detections.filter(function (d) {
            return d.label == objects_in_frame[i].label
        })
        detect.push(detec[0])
    }
    //console.log(detect)

    var coordinates = []
    detect.filter(function (d, index) {
        //console.log(d)
        trajectory = d.trajectory
        //console.log(trajectory)
        var coord = trajectory.filter(function (d) {
            return d.frame == frame_number
        })
        coordinates.push([])
        coordinates[index].push(d.label)
        coordinates[index].push(coord[0])
    })
    //console.log(coordinates)

    // Draw the bounding boxes
    svg.selectAll('rect').append('rect')
        .data(coordinates)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            //console.log(d)
            return (d[1].cx - d[1].dx) * ratio
        })
        .attr('y', function (d) {
            return (d[1].cy - d[1].dy) * ratio
        })
        .attr('width', function (d) {
            return (d[1].dx * 2) * ratio
        })
        .attr('height', function (d) {
            return (d[1].dy * 2) * ratio
        })
        .attr('fill', '#fff')
        .attr('fill-opacity', '0')
        .attr('stroke', function (d) {
            //console.log(d)
            return labels_colors[labels.indexOf(d[0])]
        })
        .attr('stroke-width', '1.5px')
        .on('mouseover', function (d) {
            var mouse_x = event.clientX
            var mouse_y = event.clientY
            text = d[0]
            color = labels_colors[labels.indexOf(d[0])]
            createTooltip(mouse_x, mouse_y, text, color)
        })
        .on('mouseout', function () {
            d3.select('#tooltip')
                .style('display', 'none')
        })
}

function showVideoPlayer(frame_number, ratio, labels, label, meetings, meetings_data) {
    var video_src = `${files_path}test.mp4`
    var verify = d3.select('#video_player_view').select('.grid-content').select('video')
    if (verify._groups[0][0] != null) {
        var mediaElement = document.getElementById('video');
        mediaElement.currentTime = frame_number / info.fps
        //console.log(`${frame_number/fps}seg`) // algo errado
        mediaElement.ontimeupdate = function () {
            //console.log(mediaElement.currentTime)
            var x_scale = createXScale(0, info.frames)
            if (meetings) {
                addLineOnMeetings(labels, label, x_scale(mediaElement.currentTime * info.fps), frame_number, meetings_data)
            }
            else {
                addLine(labels, label, x_scale(mediaElement.currentTime * info.fps))
            }
            frame_number = Math.round(mediaElement.currentTime * info.fps)
            showFrameWithBoundingBoxes(frame_number, ratio)
        }
        //mediaElement.play() 
    } else {
        var video_player = d3.select('#video_player_view').select('.grid-content').append('video')
            .attr('id', 'video')
            .attr('width', info.width * ratio)
            .attr('height', info.height * ratio)
            .attr('controls', "")
        video_player.append('source')
            .attr('src', video_src)
            .attr('type', 'video/mp4')
        var mediaElement = document.getElementById('video');
        mediaElement.currentTime = frame_number / info.fps
        mediaElement.ontimeupdate = function () {
            //console.log(mediaElement.currentTime)
            var x_scale = createXScale(0, info.frames)
            if (meetings) {
                addLineOnMeetings(labels, label, x_scale(mediaElement.currentTime * info.fps), frame_number, meetings_data)
            }
            else {
                addLine(labels, label, x_scale(mediaElement.currentTime * info.fps))
            }
            frame_number = Math.round(mediaElement.currentTime * info.fps)
            showFrameWithBoundingBoxes(frame_number, ratio)
        }
    }
}

function showBrush(ratio, data) {
    d3.select('#brush_view').select('#svg_brush').select('.grid-content').remove()
    var svg = d3.select('#brush_view').select('.grid-content').append('svg').attr('id', 'svg_brush').attr('width', info.width * ratio + 'px').attr('height', info.height * ratio + 'px')
    var foreignObject = svg.append("foreignObject").attr('id', 'fo_brush')
        .attr("width", info.width * ratio)
        .attr("height", info.height * ratio);
    // Add embedded body to foreign object
    var foBody = foreignObject.append("xhtml:body")
        .attr('id', 'body_brush')
        .style('opacity', 0.8)
        .style("margin", "0px")
        .style("padding", "0px")
        .style("background-color", "none")
        .style("width", info.width * ratio + "px")
        .style("height", info.height * ratio + "px")
        .style("border", "1px solid lightgray");
    // Add embedded canvas to embedded body
    foBody.append("canvas")
        .attr('id', 'im_canvas')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", info.width * ratio)
        .attr("height", info.height * ratio)

    var ctx = document.getElementById('im_canvas').getContext('2d')
    var url = `${files_path}/frame0.png`
    var img = new Image();
    img.onload = function () {
        ctx.scale(ratio, ratio);
        ctx.drawImage(img, 0, 0);
    };
    img.src = url;

    // ------------- Brush ---------------
    svg = d3.select("#svg_brush")
    svg.append("rect")
        .attr("class", "background")
        .style("background-color", "none")
        .attr("width", info.width * ratio)
        .attr("height", info.height * ratio)

    var brush = d3.brush()
        .extent([[0, 0], [info.width * ratio, info.height * ratio]])
        .on("end", brushing)
    svg.append("g")
        .attr("class", "brush")
        .call(brush)

    function brushing() {
        extent = d3.event.selection
        var x0 = extent[0][0] / ratio
        var y0 = extent[0][1] / ratio
        var x1 = extent[1][0] / ratio
        var y1 = extent[1][1] / ratio
        //console.log(x0, y0)
        //console.log(x1, y1)
        //console.log('\n')
        spaceFilter(x0, y0, x1, y1, data)
    }
}