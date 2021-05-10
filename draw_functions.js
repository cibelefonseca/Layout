// Function to draw the speed bars
function drawSpeedBars(data) {
    var blue_colors = ["#f7fbff", "#f6faff", "#f5fafe", "#f5f9fe", "#f4f9fe", "#f3f8fe", "#f2f8fd", "#f2f7fd", "#f1f7fd", "#f0f6fd", "#eff6fc", "#eef5fc", "#eef5fc", "#edf4fc", "#ecf4fb", "#ebf3fb", "#eaf3fb", "#eaf2fb", "#e9f2fa", "#e8f1fa", "#e7f1fa", "#e7f0fa", "#e6f0f9", "#e5eff9", "#e4eff9", "#e3eef9", "#e3eef8", "#e2edf8", "#e1edf8", "#e0ecf8", "#e0ecf7", "#dfebf7", "#deebf7", "#ddeaf7", "#ddeaf6", "#dce9f6", "#dbe9f6", "#dae8f6", "#d9e8f5", "#d9e7f5", "#d8e7f5", "#d7e6f5", "#d6e6f4", "#d6e5f4", "#d5e5f4", "#d4e4f4", "#d3e4f3", "#d2e3f3", "#d2e3f3", "#d1e2f3", "#d0e2f2", "#cfe1f2", "#cee1f2", "#cde0f1", "#cce0f1", "#ccdff1", "#cbdff1", "#cadef0", "#c9def0", "#c8ddf0", "#c7ddef", "#c6dcef", "#c5dcef", "#c4dbee", "#c3dbee", "#c2daee", "#c1daed", "#c0d9ed", "#bfd9ec", "#bed8ec", "#bdd8ec", "#bcd7eb", "#bbd7eb", "#b9d6eb", "#b8d5ea", "#b7d5ea", "#b6d4e9", "#b5d4e9", "#b4d3e9", "#b2d3e8", "#b1d2e8", "#b0d1e7", "#afd1e7", "#add0e7", "#acd0e6", "#abcfe6", "#a9cfe5", "#a8cee5", "#a7cde5", "#a5cde4", "#a4cce4", "#a3cbe3", "#a1cbe3", "#a0cae3", "#9ec9e2", "#9dc9e2", "#9cc8e1", "#9ac7e1", "#99c6e1", "#97c6e0", "#96c5e0", "#94c4df", "#93c3df", "#91c3df", "#90c2de", "#8ec1de", "#8dc0de", "#8bc0dd", "#8abfdd", "#88bedc", "#87bddc", "#85bcdc", "#84bbdb", "#82bbdb", "#81badb", "#7fb9da", "#7eb8da", "#7cb7d9", "#7bb6d9", "#79b5d9", "#78b5d8", "#76b4d8", "#75b3d7", "#73b2d7", "#72b1d7", "#70b0d6", "#6fafd6", "#6daed5", "#6caed5", "#6badd5", "#69acd4", "#68abd4", "#66aad3", "#65a9d3", "#63a8d2", "#62a7d2", "#61a7d1", "#5fa6d1", "#5ea5d0", "#5da4d0", "#5ba3d0", "#5aa2cf", "#59a1cf", "#57a0ce", "#569fce", "#559ecd", "#549ecd", "#529dcc", "#519ccc", "#509bcb", "#4f9acb", "#4d99ca", "#4c98ca", "#4b97c9", "#4a96c9", "#4895c8", "#4794c8", "#4693c7", "#4592c7", "#4492c6", "#4391c6", "#4190c5", "#408fc4", "#3f8ec4", "#3e8dc3", "#3d8cc3", "#3c8bc2", "#3b8ac2", "#3a89c1", "#3988c1", "#3787c0", "#3686c0", "#3585bf", "#3484bf", "#3383be", "#3282bd", "#3181bd", "#3080bc", "#2f7fbc", "#2e7ebb", "#2d7dbb", "#2c7cba", "#2b7bb9", "#2a7ab9", "#2979b8", "#2878b8", "#2777b7", "#2676b6", "#2574b6", "#2473b5", "#2372b4", "#2371b4", "#2270b3", "#216fb3", "#206eb2", "#1f6db1", "#1e6cb0", "#1d6bb0", "#1c6aaf", "#1c69ae", "#1b68ae", "#1a67ad", "#1966ac", "#1865ab", "#1864aa", "#1763aa", "#1662a9", "#1561a8", "#1560a7", "#145fa6", "#135ea5", "#135da4", "#125ca4", "#115ba3", "#115aa2", "#1059a1", "#1058a0", "#0f579f", "#0e569e", "#0e559d", "#0e549c", "#0d539a", "#0d5299", "#0c5198", "#0c5097", "#0b4f96", "#0b4e95", "#0b4d93", "#0b4c92", "#0a4b91", "#0a4a90", "#0a498e", "#0a488d", "#09478c", "#09468a", "#094589", "#094487", "#094386", "#094285", "#094183", "#084082", "#083e80", "#083d7f", "#083c7d", "#083b7c", "#083a7a", "#083979", "#083877", "#083776", "#083674", "#083573", "#083471", "#083370", "#08326e", "#08316d", "#08306b"]
    var blues = d3.scaleQuantize()
        .domain(d3.extent([0, max_speed]))
        .range(blue_colors)

    // Create Scales
    var x_scale = createXScale(0, info.frames)
    var x_scale_inverse = createXScaleInverse(0, info.frames)
    var y_scale = createYScale(uniqueLabels(data))

    //Group the new bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
        .key(function (d) { return d.label })
        .entries(data)
    // Select the bars group
    var bars = d3.select('.bars')
    var verify = d3.select(`#speed_bars`)
    //console.log(verify._groups[0][0])
    // If there's no speed_bars group
    if (verify._groups[0][0] == null) {
        var bars_group = bars.append('g').attr('id', 'speed_bars').style('opacity', 0.7)
        // If the group already exists, removes all the rectangles inside of it and changes the display attribute
    } else {
        var bars_group = d3.select(`#speed_bars`)
        bars_group.selectAll('g')
            .remove()
        bars_group.style('display', 'block')
    }

    // Bind Data and Create Bars
    bars_group = bars_group.selectAll('rect')
        .data(nested_data)
        .enter()
        .append('g')
        .attr('id', function (d) {
            return d.key + `_speed_bars`
        })
    bars_group.selectAll('rect').append('rect')
        .data(function (d) {
            return d.values
        })
        .enter().append('rect')
        .attr('x', function (d) {
            return x_scale(d.start)
        })
        .attr('y', function (d) {
            return y_scale(labels.indexOf(d.label))
        })
        .attr('width', function (d) {
            return x_scale(d.finish) - x_scale(d.start)
        })
        .attr('height', y_scale.bandwidth())
        .attr('fill', function (d) {
            return blues(d.speed)
        })
        .on('mouseover', function (d) {
            var mouse_x = event.clientX
            var bar_y = parseFloat(d3.select(this).attr('y')) +
                y_scale.bandwidth() * 2.5
            d3.select('#tooltip')
                .style('left', mouse_x + "px")
                .style('top', bar_y + "px")
                .style('display', 'block')
                .text(d.label + `: ` + d.speed.toFixed(2))
                .style('color', '#808080')
        })
        .on('mouseout', function () {
            d3.select('#tooltip')
                .style('display', 'none')
        })
        .on('click', function (d) {
            var mouse_x = event.clientX
            mouse_x -= x_padding / 2
            addLine(labels, d.label, mouse_x)
            var frame_number = Math.round(x_scale_inverse(mouse_x))
            /* if (frame_number >= finish){
                frame_number = finish-1
            } */
            showFrameWithBoundingBoxes(frame_number, ratio)
            showVideoPlayer(frame_number, ratio, labels, d.label, false, '')
        })
    drawSpeedLegend(data, blues)
}

function drawSpeedLegend(data, blues) {
    //console.log(data)
    verify = d3.select('#svg_legend')
    if (verify._groups[0][0] != null) {
        verify.remove()
    }

    // speeds_array: a array with distinct speeds
    var speeds_array = []
    for (var i in data) {
        speeds_array.push(data[i].speed)
    }
    // Removes repeated speeds
    speeds_array = speeds_array.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
    })
    // Sort the speeds in speeds_array
    speeds_array.sort((a, b) => {
        var comparison = 0
        if (Number(a) > Number(b)) {
            comparison = 1
        } else if (Number(a) < Number(b)) {
            comparison = -1
        }
        return comparison
    })

    // Create the svg
    var legend = document.getElementById("legend");
    /* var txt = "Height with padding and border: " + legend.offsetHeight + "px\n";
    txt += "Width with padding and border: " + legend.offsetWidth + "px";
    console.log(txt) */
    p = d3.select('#legend').select('p')
    console.log(p._groups[0][0].innerHTML)
    p._groups[0][0].innerHTML += '<br>px/s'
    //p.innerHTML += 'px/s'
    var svg_width = legend.offsetWidth - 10
    var svg_heigth = legend.offsetHeight * 0.9
    d3.select('#legend').append('svg')
        .attr('id', 'svg_legend')
        .attr('width', `${svg_width}px`)
        .attr('height', `${svg_heigth}px`)
    var svg_legend = d3.select('#svg_legend')

    //Scales and y axis
    var y_scale = d3.scaleBand()
        .domain(d3.range(speeds_array.length))
        .range([5, svg_heigth - 5])
    var x_scale = d3.scaleBand()
        .domain([0])
        .range([svg_width - 10, svg_width])
    var y_axis = d3.axisLeft(y_scale)
        .ticks(1)
        .tickFormat(function (d) {
            return speeds_array[d].toFixed(2)
        })
    svg_legend.append('g')
        .attr('class', 'y-axis-legend')
        .attr(
            'transform',
            `translate(${svg_width - 12},0)`
        )
        .call(y_axis)

    // Add rectangles in svg
    svg_legend.selectAll('rect').append('rect')
        .data(speeds_array)
        .enter()
        .append('rect')
        .attr('x', x_scale(0))
        .attr('y', function (d, i) {
            return y_scale(i)
        })
        .attr('width', 10)
        .attr('height', (svg_heigth - 10) / speeds_array.length)
        .attr('fill', function (d) {
            return blues(d)
        })
        .attr('stroke', '#808080')
        .attr('stroke-width', '0.1px')
        .on('mouseover', function (d) {
            var mouse_x = event.clientX
            var bar_y = parseFloat(d3.select(this).attr('y')) +
                y_scale.bandwidth() * 2.5
            d3.select('#tooltip')
                .style('left', mouse_x + "px")
                .style('top', bar_y + "px")
                .style('display', 'block')
                .text(function () {
                    return d.toFixed(2)
                })
                .style('color', function () {
                    return '#808080'
                })
        })
        .on('mouseout', function () {
            d3.select('#tooltip')
                .style('display', 'none')
        })
}

// Function to draw the all meetings bars
function drawAllMeetingsBars(original_data, data, info) {
    // If there is some meeting we'll add it to the visualization
    if (data.length != 0) {
        var fps = info.fps
        var labels = uniqueLabels(original_data)
        var finish = info.frames
        // Select the temporal-visualization group that is inside svg
        var temporal_visualization = d3.select('.temporal-visualization')

        // Create Scales
        var x_scale = createXScale(0, finish)
        var x_scale_inverse = createXScaleInverse(0, finish)
        var y_scale = createYScale(labels)

        //Group the new bars belonging to the same object
        var nested_data = []
        nested_data = d3.nest()
            .key(function (d) { return d.label })
            .entries(data)
        //console.log(nested_data);

        // Select the bars group
        var bars = temporal_visualization.select('.bars')
        var bars_group = bars.append('g')
            .attr('id', 'allmeetings_bars')
            .style('opacity', 0.7)

        // Bind Data and Create Bars
        bars_group = bars_group.selectAll('rect')
            .data(nested_data)
            .enter()
            .append('g')
            .attr('id', function (d) {
                return d.key + `_allmeetings_bars`
            })
        bars_group.selectAll('rect').append('rect')
            .data(function (d) {
                return d.values
            })
            .enter().append('rect')
            .attr('x', function (d) {
                return x_scale(d.start)
            })
            .attr('y', function (d) {
                return y_scale(labels.indexOf(d.label))
            })
            .attr('width', function (d) {
                return x_scale(d.finish) - x_scale(d.start)
            })
            .attr('height', y_scale.bandwidth())
            .attr('fill', '#F00D00')
            .attr('stroke-width', '1px')
            .on('mouseover', function (d) {
                var mouse_x = event.clientX
                var bar_y = parseFloat(d3.select(this).attr('y')) +
                    y_scale.bandwidth() * 2.5
                var object_array = d.object
                if (object_array.length == 1) {
                    var text = `${d.label} {Number: ${object_array.length} | Object: [${object_array.toString()}]}`
                } else {
                    var text = `${d.label} {Number: ${object_array.length} | Objects: [${object_array.toString()}]}`
                }
                color = '#F00D00'
                createTooltip(mouse_x, bar_y, text, color)
            })
            .on('mouseout', function () {
                d3.select('#tooltip')
                    .style('display', 'none')
            })
            .on('click', function (d) {
                console.log(nested_data)
                var mouse_x = event.clientX
                mouse_x -= x_padding / 2
                addLineOnMeetings(labels, d.label, mouse_x, frame_number, nested_data)
                var frame_number = Math.round(x_scale_inverse(mouse_x))
                showFrameWithBoundingBoxes(frame_number, ratio)
                showVideoPlayer(frame_number, ratio, labels, d.label, true, nested_data)
            })
    }
}

// Function to redraw the all meetings bars
function redrawAllMeetingsBars(original_data, data, info) {
    fps = info.fps
    console.log('redrawAllMeetings')
    // Select the bars group
    var bars_group = d3.select(`#allmeetings_bars`)

    // Remove the bars
    bars_group.selectAll('g')
        .remove()

    // Just redraw if there's some element in data
    if (data.length != 0) {
        var labels = uniqueLabels(original_data)
        var finish = info.frames
        // Create Scales
        var x_scale = d3.scaleLinear()
            .domain([
                0, finish
            ])
            .range([y_padding, chart_width - x_padding])
        //console.log([y_padding, chart_width-x_padding])

        var x_scale_inverse = d3.scaleLinear()
            .domain([
                y_padding, chart_width - x_padding

            ])
            .range([0, finish])

        var y_scale = d3.scaleBand()
            .domain(d3.range(labels.length))
            //.rangeRound([0, chart_height - y_padding])
            .rangeRound([0, 15 * labels.length])
            .paddingInner(0.3)

        //Group the new bars belonging to the same object
        var nested_data = []
        nested_data = d3.nest()
            .key(function (d) { return d.label })
            .entries(data)

        // Bind Data and Create Bars
        bars_group = bars_group.selectAll('rect')
            .data(nested_data)
            .enter()
            .append('g')
            .attr('id', function (d) {
                return d.key + '_allmeetings_bars'
            })
        bars_group.selectAll('rect').append('rect')
            .data(function (d) {
                return d.values
            })
            .enter().append('rect')
            .attr('x', function (d) {
                return x_scale(d.start)
            })
            .attr('y', function (d) {
                return y_scale(labels.indexOf(d.label))
            })
            .attr('width', function (d) {
                return x_scale(d.finish) - x_scale(d.start)
            })
            .attr('height', y_scale.bandwidth())
            .attr('fill', '#F00D00')
            .attr('stroke-width', '1px')
            .on('mouseover', function (d) {
                var mouse_x = event.clientX
                var bar_y = parseFloat(d3.select(this).attr('y')) +
                    y_scale.bandwidth() * 2.5
                var object_array = d.object
                if (object_array.length == 1) {
                    var text = `${d.label} {Number: ${object_array.length} | Object: [${object_array.toString()}]}`
                } else {
                    var text = `${d.label} {Number: ${object_array.length} | Objects: [${object_array.toString()}]}`
                }
                color = '#F00D00'
                createTooltip(mouse_x, bar_y, text, color)
            })
            .on('mouseout', function () {
                d3.select('#tooltip')
                    .style('display', 'none')
            })
            .on('click', function (d) {
                var mouse_x = event.clientX
                mouse_x -= x_padding * 2 - 3 // subtrai o x_padding da esquerda e direita e os 3 pixels da linha
                addLineOnMeetings(labels, d.label, mouse_x, frame_number, nested_data)
                var frame_number = Math.round(x_scale_inverse(mouse_x))
                showFrameWithBoundingBoxes(frame_number, ratio)
                showVideoPlayer(frame_number, ratio, labels, d.label, true, nested_data)
            })
    }
}

var u_numbers = []
// Create red colors
function redColors(meeting_bars) {
    //console.log(meeting_bars)
    var numbers = []
    for (i in meeting_bars) {
        numbers.push(meeting_bars[i].object.length)
    }
    //console.log(numbers)
    var unique_numbers = numbers.filter(function (item, pos) {
        return numbers.indexOf(item) == pos;
    })
    unique_numbers.sort()
    u_numbers = unique_numbers
    //console.log(unique_numbers)

    var values = []
    const vratio = 0.5 / unique_numbers.length
    for (i in unique_numbers) {
        //console.log(`${Number(i)+1} x ${vratio}`)
        values.push((Number(i) + 1) * vratio + 0.5)
    }
    var colors = []
    for (i in values) {
        colors.push(d3.interpolateReds(values[i]))
    }
    return colors
}

// I don't need to do the redrawMeentingsBars yet
// Function to draw the meetings bars
function drawMeetingsBars(labels_checked, original_data, data, group_id) {
    if (data.length != 0) {
        var finish = info.frames
        var labels = uniqueLabels(original_data)
        // Create Scales
        var x_scale = createXScale(0, finish)
        var x_scale_inverse = createXScaleInverse(0, finish)
        var y_scale = createYScale(labels)

        var reds = []

        //Group the new bars belonging to the same object
        var nested_data = []
        nested_data = d3.nest()
            .key(function (d) { return d.label })
            .entries(data)
        if (labels_checked.length == 1) {
            for (i in nested_data) {
                if (nested_data[i].key == labels_checked[0])
                    var meeting_bars = nested_data[i].values
                reds = redColors(meeting_bars)
                break
            }
        }

        // Is there a meetings_bars group already?
        var verify = d3.select('#meetings_bars')
        if (verify._groups[0][0] == null) {
            // Create the meetings_bars group
            var bars_group = d3.select('#bars')
                .append('g')
                .attr('id', 'meetings_bars')
                .style('opacity', 0.7)
            // Create the group corresponding to the selected object(s)
            bars_group = bars_group.append('g')
                .attr('id', group_id)
        } else {
            // For while, delete the meetings inside the meetings_bars group
            verify.selectAll('g').remove()
            // Create the group corresponding to the selected object(s)
            var bars_group = verify.append('g').attr('id', group_id)
        }
        //console.log(nested_data)

        // Bind Data and Create Bars
        bars_group = bars_group.selectAll('rect')
            .data(nested_data)
            .enter()
            .append('g')
            .attr('id', function (d) {
                return d.key + '_meetings_bars'
            })
        bars_group.selectAll('rect').append('rect')
            .data(function (d) {
                return d.values
            })
            .enter().append('rect')
            .attr('x', function (d) {
                return x_scale(d.start)
            })
            .attr('y', function (d) {
                return y_scale(labels.indexOf(d.label))
            })
            .attr('width', function (d) {
                return x_scale(d.finish) - x_scale(d.start)
            })
            .attr('height', bars_height)
            .attr('fill', function (d) {
                if (labels_checked.length != 1) {
                    return '#F00D00'
                } else {
                    if (labels_checked[0] != d.label) {
                        return '#464646'
                    } else {
                        var objects = d.object
                        return reds[u_numbers.indexOf(objects.length)]
                        //console.log(u_numbers)
                        //return '#F00D00'
                    }
                }
            })
            .attr('stroke-width', '1px')
            .on('mouseover', function (d) {
                var mouse_x = event.clientX
                var bar_y = parseFloat(d3.select(this).attr('y')) +
                    y_scale.bandwidth() * 2.5
                var object_array = d.object
                if (object_array.length == 1) {
                    var text = `${d.label} {Number: ${object_array.length} | Object: [${object_array.toString()}]}`
                } else {
                    var text = `${d.label} {Number: ${object_array.length} | Objects: [${object_array.toString()}]}`
                }
                color = '#F00D00'
                createTooltip(mouse_x, bar_y, text, color)
            })
            .on('mouseout', function () {
                d3.select('#tooltip')
                    .style('display', 'none')
            })
            .on('click', function (d) {
                //console.log(nested_data)
                var mouse_x = event.clientX
                //mouse_x -= x_padding * 2 - 3 // subtrai o x_padding da esquerda e direita e os 3 pixels da linha
                mouse_x -= x_padding / 2
                var frame_number = Math.round(x_scale_inverse(mouse_x))
                addLineOnMeetings(labels, d.label, mouse_x, frame_number, nested_data)
                showFrameWithBoundingBoxes(frame_number, ratio)
                showVideoPlayer(frame_number, ratio, labels, d.label, true, nested_data)
            })
        if (labels_checked.length == 1) {
            addMeetingsLine(meeting_bars, labels)
            drawMeetingsLegend(u_numbers, reds)
        }


    } else {
        // Is there a meetings_bars group already?
        var verify = d3.select('#meetings_bars')
        if (verify._groups[0][0] == null) {
            // Create the meetings_bars group
            var bars_group = d3.select('#bars')
                .append('g')
                .attr('id', 'meetings_bars')
            // Create the group corresponding to the selected object(s)
            bars_group = bars_group.append('g')
                .attr('id', group_id)
        } else {
            // For while, delete the meetings inside the meetings_bars group
            verify.selectAll('g').remove()
            // Create the group corresponding to the selected object(s)
            var bars_group = verify.append('g').attr('id', group_id)
        }
    }
}

function addMeetingsLine(meeting_bars, labels) {
    // Verify if there is the #meetings_marker group, if there's not create it
    var verify = d3.select('#meetings_marker')
    if (verify._groups[0][0] != null) {
        verify.selectAll('line').remove()
    } else {
        d3.select('#bars').append('g').attr('id', 'meetings_marker')
    }

    // Create y_scale
    var y_scale = createYScale(labels)
    var x_scale = createXScale(0, info.frames)

    console.log(meeting_bars)
    var x_coordinates = []
    for (i in meeting_bars) {
        for (j in meeting_bars[i].object) {
            x_coordinates.push({ frame: meeting_bars[i].start, object: [meeting_bars[i].label] })
            x_coordinates.push({ frame: meeting_bars[i].start, object: meeting_bars[i].object[j] })
            x_coordinates.push({ frame: meeting_bars[i].finish, object: meeting_bars[i].object[j] })
            x_coordinates.push({ frame: meeting_bars[i].finish, object: [meeting_bars[i].label] })
        }
    }
    console.log(x_coordinates)

    var meetings_marker = d3.select('#meetings_marker')
    meetings_marker.selectAll('line')
        .data(x_coordinates)
        .enter()
        .append('line')
        .attr('x1', function (d) {
            return x_scale(d.frame)
        })
        .attr('y1', function (d) {
            return y_scale(labels.indexOf(d.object[0]))
        })
        .attr('x2', function (d) {
            return x_scale(d.frame)
        })
        .attr('y2', function (d) {
            return y_scale(labels.indexOf(d.object[0])) + y_scale.bandwidth()
        })
        .attr('stroke', 'yellow')
        .attr('stroke-width', '1px')
        .on('mouseover', function (d) {
            var mouse_x = event.clientX
            var bar_y = event.clientY
            var text = `${d.frame / info.fps}s`
            var color = '#f6fa00'
            createTooltip(mouse_x, bar_y, text, color)
        })
        .on('mouseout', function () {
            d3.select('#tooltip')
                .style('display', 'none')
        })
        .on('click', function (d) {
            showFrameWithBoundingBoxes(d.frame, ratio)
            var mediaElement = document.getElementById('video');
            mediaElement.currentTime = d.frame / info.fps
        })
}

function drawMeetingsLegend(u_numbers, reds) {
    console.log(u_numbers)
    console.log(reds)
}

function addLineOnMeetings(labels, label, mouse_x, frame_number, nested_data) {
    // Verify if there is the #marker group, if there's not create it
    var verify = d3.select('#marker')
    if (verify._groups[0][0] != null) {
        verify.selectAll('line').remove()
    } else {
        d3.select('#bars').append('g').attr('id', 'marker')
    }

    //console.log(nested_data)
    // Create y_scale
    var y_scale = createYScale(labels)

    var keys = []
    for (i in nested_data) {
        keys.push(nested_data[i].key)
    }
    //console.log(keys)
    var label_index = keys.indexOf(label)

    for (i in nested_data[label_index].values) {
        //console.log(nested_data[label_index].values[i])
        if (frame_number >= nested_data[label_index].values[i].start && frame_number <= nested_data[label_index].values[i].finish) {
            var label_selected = nested_data[label_index].values[i].object
        }
    }
    //console.log(label_selected)

    var marker = d3.select('#marker')
    marker.append('line')
        .attr('x1', mouse_x - (marker_width / 2))
        .attr('y1', y_scale(labels.indexOf(label)))
        .attr('x2', mouse_x - (marker_width / 2))
        .attr('y2', y_scale(labels.indexOf(label)) + y_scale.bandwidth())
        .attr('stroke', 'black')
        .attr('stroke-width', '3px')
        .on('click', function () {
            d3.select('#marker').remove()
        })
    for (var i in label_selected) {
        marker.append('line')
            .attr('x1', mouse_x - (marker_width / 2))
            .attr('y1', y_scale(labels.indexOf(label_selected[i].toString())))
            .attr('x2', mouse_x - (marker_width / 2))
            .attr('y2', y_scale(labels.indexOf(label_selected[i].toString())) + y_scale.bandwidth())
            .attr('stroke', 'black')
            .attr('stroke-width', '3px')
            .on('click', function () {
                d3.select('#marker').remove()
            })
    }
}

function drawSortBars(data) {
    d3.select('#time_bars_view').selectAll('svg').remove()
    d3.select('#brush_view').selectAll('svg').remove()
    generate(data, detections)
}

function drawSpaceFilterBars(time_bars, data) {
    // Redraw the temporal visualization
    d3.select('#time_bars_view').selectAll('svg').remove()
    var labels = uniqueLabels(time_bars)
    console.log(labels)
    var fps = info.fps
    var chart_height = labels.length * 15 + 25

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
        .attr('id', function (d) {
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
        .entries(time_bars)
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
        .attr('height', 11)
        .attr('fill', '#808080')
        .attr('stroke', '#808080')
        .attr('stroke-width', '1px')
        .on('mouseover', function (d) {
            var mouse_x = event.clientX
            var bar_y = parseFloat(d3.select(this).attr('y')) +
                y_scale.bandwidth() * 2.5
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
            mouse_x -= x_padding * 2 - 3 // subtrai o x_padding da esquerda e direita e os 3 pixels da linha
            addLine(labels, d.label, mouse_x)
            var frame_number = Math.round(x_scale_inverse(mouse_x))
            showFrameWithBoundingBoxes(frame_number, ratio)
            showVideoPlayer(frame_number, ratio, labels, d.label, false, '')

        })
    // Is there a space_filter_bars group already?
    var verify = d3.select('#space_filter_bars')
    if (verify._groups[0][0] == null) {
        // Create the space_filter_bars group
        var bars_group = d3.select('#bars')
            .append('g')
            .attr('id', 'space_filter_bars')
    } else {
        // Remove  space_filter_bars group
        verify.remove()
    }

    var fps = info.fps
    var labels = uniqueLabels(data)
    var finish = info.frames
    // Select the temporal-visualization group that is inside svg
    var temporal_visualization = d3.select('.temporal-visualization')

    // Create Scales
    var x_scale = d3.scaleLinear()
        .domain([
            0, finish
        ])
        .range([y_padding, chart_width - x_padding])
    //console.log([y_padding, chart_width-x_padding])

    var x_scale_inverse = d3.scaleLinear()
        .domain([
            y_padding, chart_width - x_padding

        ])
        .range([0, finish])

    var y_scale = d3.scaleBand()
        .domain(d3.range(labels.length))
        //.rangeRound([0, chart_height - y_padding])
        .rangeRound([0, 15 * labels.length])
        .paddingInner(0.3)

    //Group the new bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
        .key(function (d) { return d.label })
        .entries(data)
    //console.log(nested_data);

    // Select the space_filter_bars group
    var bars = temporal_visualization.select('.bars')
    var bars_group = bars.append('g')
        .attr('id', 'space_filter_bars')
        .style('opacity', 0.7)

    // Bind Data and Create Bars
    bars_group = bars_group.selectAll('rect')
        .data(nested_data)
        .enter()
        .append('g')
        .attr('id', function (d) {
            return d.key + `_space_filter_bars`
        })
    bars_group.selectAll('rect').append('rect')
        .data(function (d) {
            return d.values
        })
        .enter().append('rect')
        .attr('x', function (d) {
            return x_scale(d.start)
        })
        .attr('y', function (d) {
            return y_scale(labels.indexOf(d.label))
        })
        .attr('width', function (d) {
            return x_scale(d.finish) - x_scale(d.start)
        })
        .attr('height', y_scale.bandwidth())
        .attr('fill', '#464646')
        .on('mouseover', function (d) {
            var mouse_x = event.clientX
            var bar_y = parseFloat(d3.select(this).attr('y')) +
                y_scale.bandwidth() * 2.5
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
            mouse_x -= x_padding * 2 - 3 // subtrai o x_padding da esquerda e direita e os 3 pixels da linha
            addLine(labels, d.label, mouse_x)
            var frame_number = Math.round(x_scale_inverse(mouse_x))
            /* if (frame_number >= finish){
                frame_number = finish-1
            } */
            showFrameWithBoundingBoxes(frame_number, ratio)
            showVideoPlayer(frame_number, ratio, labels, d.label, false, '')
        })
}