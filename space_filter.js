function spaceFilter(x0, y0, x1, y1, info){
    frame.on('#space_filter', 'click', (_frame, evt) => {
        //console.log(x0, y0, x1, y1)
        d3.json(`${files_path}detections.json`, function(data){
            //console.log(data)
            var new_data = []
            var new_trajectory = []
            var index = -1
            for (var i in data){
                var space_flag = false
                //console.log(data[i])
                for (var j in data[i].trajectory){
                    var x_top_left = data[i].trajectory[j].cx - data[i].trajectory[j].dx
                    var y_top_left = data[i].trajectory[j].cy - data[i].trajectory[j].dy
                    var x_bottom_right = data[i].trajectory[j].cx + data[i].trajectory[j].dx
                    var y_bottom_right = data[i].trajectory[j].cy + data[i].trajectory[j].dy
                    if(x_top_left >= x0 && x_top_left<= x1 &&
                        y_top_left >= y0 && y_top_left <= y1 ||
                        x_bottom_right >= x0 && x_bottom_right <=x1 &&
                        y_bottom_right >= y0 && y_bottom_right <= y1){
                        //new_trajectory.push(data[i].trajectory[j])
                        new_data.push({label: data[i].label, trajectory: data[i].trajectory})
                        break
                    }
                }
                
                for (var j in data[i].trajectory){
                    var x_top_left = data[i].trajectory[j].cx - data[i].trajectory[j].dx
                    var y_top_left = data[i].trajectory[j].cy - data[i].trajectory[j].dy
                    var x_bottom_right = data[i].trajectory[j].cx + data[i].trajectory[j].dx
                    var y_bottom_right = data[i].trajectory[j].cy + data[i].trajectory[j].dy
                    if(x_top_left >= x0 && x_top_left<= x1 &&
                        y_top_left >= y0 && y_top_left <= y1 ||
                        x_bottom_right >= x0 && x_bottom_right <=x1 &&
                        y_bottom_right >= y0 && y_bottom_right <= y1){
                        if (space_flag == false){
                            new_trajectory.push({label: data[i].label, trajectory: []})
                            index += 1
                            new_trajectory[index].trajectory.push(data[i].trajectory[j])
                            space_flag = true
                        } else {
                            new_trajectory[index].trajectory.push(data[i].trajectory[j])
                        }
                        
                    }
                }
            }
            //console.log(new_data)
            //console.log(new_trajectory)
            if(new_data.length != 0){
                items1 = new_data
                items = new_data
                var time_bars = createTimeBarsInputArray(new_data)
                var space_time_bars = createTimeBarsInputArray(new_trajectory)
                //console.log(time_bars)
                d3.select('#chart').select('svg').remove()
                showSpeed(time_bars)
                showAllMeetings(time_bars)
                showMeetings(time_bars)
                createObjectTypesDropdownOnFrame(data)
                seeObjectTypesFilterOnFrame()
                sortSelectorActionOnFrame(data)
                ShowStatistics(data)
                timeFilter(new_data)
                drawSpaceFilterBars(time_bars, space_time_bars)
            } else {
                alert('No objects passed through this space during the video.')
            }
        })
        
    })
}

var background_input = frame.$('#img_input')
background_input.addEventListener('change', handleFiles, false);

function handleFiles(e) {
    d3.json(`${files_path}video_infos.json`, function(data){
        d3.select('#imbrush').select('#svg_brush').remove()
        //console.log(data)
        var URL = window.webkitURL || window.URL;
        var max_width = 400
        var max_height = 300
        var im_width = data.width
        var im_height = data.height
        console.log()
        var ratio = 1;
        if (im_width > max_width) {
                ratio = max_width / im_width;
        }
        if (ratio * im_height > max_height) {
            ratio = max_height / im_height;
        }
        var svg = d3.select('#imbrush').append('svg').attr('id','svg_brush').attr('width', im_width*ratio+'px').attr('height', im_height*ratio+'px')
        var foreignObject = svg.append("foreignObject").attr('id', 'fo_brush')
        .attr("width", im_width*ratio)
        .attr("height", im_height*ratio);
        // Add embedded body to foreign object
        var foBody = foreignObject.append("xhtml:body")
        .attr('id','body_brush')
        .style('opacity', 0.7)
        .style("margin", "0px")
        .style("padding", "0px")
        .style("background-color", "none")
        .style("width", im_width*ratio + "px")
        .style("height", im_height*ratio + "px")
        .style("border", "1px solid lightgray");
        // Add embedded canvas to embedded body
        var canvas = foBody.append("canvas")
        .attr('id', 'im_canvas')
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", im_width*ratio)
        .attr("height", im_height*ratio)

        var ctx1 = document.getElementById('im_canvas').getContext('2d')
        var url1 = URL.createObjectURL(e.target.files[0])
        var img1 = new Image();
        img1.onload = function() {
            var ratio = 1;
            if (img1.width > max_width) {
                ratio = max_width / img1.width;
            }
            if (ratio * img1.height > max_height) {
                ratio = max_height / img1.height;
            }
            ctx1.scale(ratio, ratio);
            ctx1.drawImage(img1, 0, 0);
        };
        img1.src = url1;

        // ------------- Brush ---------------
        svg = d3.select("#svg_brush")
        svg.append("rect")
        .attr("class", "background")
        .style("background-color", "none")
		.attr("width", im_width*ratio)
        .attr("height", im_height*ratio)
        
        var brush = d3.brush()
            .extent([[0, 0], [im_width*ratio, im_height*ratio]])
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
    })
}