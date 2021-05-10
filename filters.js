const jsFrame = new JSFrame();

//Create window
const frame = jsFrame.create({
    title: 'Filters',
    left: 20, top: 20, width: 320, height: 700,
    appearanceName: 'material',
    appearanceParam: {
        titleBar: {
            color: 'white',
            background: '#a9a9a9',
        }
    },
    style: {
        backgroundColor: 'rgba(255,255,255)',
        overflow: 'hidden',
        width: '100%',
    },
    movable: true,//Enable to be moved by mouse
    resizable: false,//Enable to be resized by mouse
    //url: './html_utils/jsframe_filters_content.html'
    html: `<div id="filters_div" style="padding:10px;font-size:12px;color:darkgray;padding: 5;">
        <div id="view_speed">
            <p>Enter the time interval to calculate the average speed:</p>
            <input type="number" id="minutes_speed" min="0" step="1" value="00">:
            <input type="number" id="seconds_speed" min="0" max="59" step="1" value="01">
            <p>Show the average speed of all the objects:</p>
            <button id="speed">Show Speed</button>
            <button id="clear_speed">Clear</button>
        </div>
        <div class="view_meetings">
            <p>Enter a minimum time for a meeting to be considered:</p>
            <input type="number" id="minutes" min="0" step="1" value="00">:
            <input type="number" id="seconds" min="0" max="59" step="1" value="01">
            <p>Choose an approach:</p>
            <input type="checkbox" id="meetingsapproach1" name="approach1" value="1">
            <label for="approach1">Intersection</label><br>
            <input type="checkbox" id="meetingsapproach2" name="approach2" value="2">
            <label for="approach2">Threshold</label>
            <input type="number" id="threshold" min="0" max="2" step="0.1" value="0.5"><br>
            <p>Show all the meetings of the objects:</p>
            <button id="all_meetings">Show All Meetings</button>
            <button id="clear_all_meetings">Clear</button>
            <p>Show the meetings of the selected objects:</p>
            <button id="meetings">Show Meetings</button>
            <button id="clear_meetings">Clear</button>
        </div>
        <div class="multiselect_object_types">
            <p>Show only objects of the type(s):</p>
            <div class="selectbox_filter">
                <select id="selectbox_object_types" onclick="showDropdown()">
                    <option selected disabled hidden>Select object type(s)</option>
                </select>
                <button id="object_type_filter">Show</button>
                <button id="clear_object_type_filter">Clear</button>
            </div>
            <div id="checkboxes_object_types">

            </div>
        </div>
        <div class="sort">
            <p>Sort by:</p>
            <select name="" id="selector_sort">
                <option value="1" selected="selected">Original</option>
                <option value="2">Scene Permanence</option>
                <option value="3">Number of Meetings</option>
                <option value="5">Distinct Objects Meet</option>
                <option value="4">Time in Meetings</option>
                
            </select>
        </div>
        <div>
            <p>Enter the background image:</p>
            <input type="file" id="img_input" />
            <br>
            <button id="space_filter">Filter by Space</button>
        </div>
        <div>
            <p></p>
            <button id="show_statistics">Show Statistics</button>
        </div>
    </div>`
});

//frame.setPosition(20,530,['LEFT_TOP']);

frame.setControl({
    maximizeButton: 'maximizeButton',
    demaximizeButton: 'restoreButton',
    minimizeButton: 'minimizeButton',
    deminimizeButton: 'deminimizeButton',
    hideButton: 'closeButton',
    animation: true,
    animationDuration: 150,

});

frame.control.on('hid', (frame, info) => {
    frame.closeFrame();
});

//Callback when calling after mazimization
frame.control.on('maximized', (frame, info) => {
    jsFrame.showToast({
        text: 'Maximized'
    });
});
frame.control.on('demaximized', (frame, info) => {
});
frame.control.on('minimized', (frame, info) => {
});
frame.control.on('dminimized', (frame, info) => {
});

// Show JSFrame on webpage
function showJSFrame(data, start_time, finish_time) {
    frame.show()
    showSpeed(data)
    showAllMeetings(data)
    showMeetings(data)
    createObjectTypesDropdownOnFrame(data)
    seeObjectTypesFilterOnFrame()
    sortSelectorActionOnFrame(data)
    ShowStatistics(data)
}

// Get the previous time to calculate the average speed
var ant_seconds_speed_total = 0
// Show the speed bars
function showSpeed(data) {
    d3.select('#speed').on('click', function () {
        // Get the speed time portion 
        var minutes = Number(frame.$('#minutes_speed').value)
        var seconds = Number(frame.$('#seconds_speed').value)
        var seconds_total = minutes * 60 + seconds
        var verify = d3.select(`#speed_bars`)
        if (seconds_total != ant_seconds_speed_total || verify._groups[0][0] == null) {
            var data_speed = calculateSpeed(data, seconds_total)
            //console.log(data_speed)
            drawSpeedBars(data_speed)
        }
        ant_seconds_speed_total = seconds_total
    })
    d3.select('#clear_speed').on('click', function () {
        // Just remove the speed_bars group when you close the tab/layer (it will still be implemented)
        //d3.select(`#speed_bars`).style('display', 'none')
        d3.select(`#speed_bars`).remove()
        d3.select('#svg_legend').remove()
    })
}

// Get the previous minimum total of seconds of a meeting
var ant_seconds_total = 0
function showAllMeetings(data) {
    d3.select('#all_meetings').on('click', function () {
        // Get the minimum meeting time
        var minutes = frame.$('#minutes').value
        var seconds = frame.$('#seconds').value
        var seconds_total = minutes * 60 + seconds
        var threshold = frame.$('#threshold').value
        // Call calculateAllMeetings() function to calculate all the meetings according to the meeting time
        // If theres no elements in all_meetings so we calculate it
        var verify = d3.select('#allmeetings_bars')
        if (all_meetings.length == 0) {
            //
            if (document.getElementById("meetingsapproach1").checked && document.getElementById("meetingsapproach2").checked) {
                alert('Select just one approach.')
            }
            else if (document.getElementById("meetingsapproach1").checked){
                var meetings = calculateAllMeetings(seconds_total, info.fps)
            }
            else if (document.getElementById("meetingsapproach2").checked) {
                var meetings = calculateAllMeetings2(seconds_total, info.fps, threshold)
            }
            else {
                alert('Select at least one approach.')
            }
            //console.log(meetings)
            drawAllMeetingsBars(data, meetings, info)
            // If all_meetings was already calculated and there's no allmeetings_bars group
        } else if (all_meetings.length != 0 && verify._groups[0][0] == null) {
            drawAllMeetingsBars(data, all_meetings, info)
            // If all meetings with this minimum time for a meeting is already calculated, so we don't need to calculate it again
        } else if (all_meetings.length != 0 && ant_seconds_total == seconds_total) {
            d3.select('#allmeetings_bars').style('display', 'block')
            // If minimum time changed we calculate all meetings again
        } else {
            ant_seconds_total = seconds_total
            //var meetings = calculateAllMeetings(seconds_total, info.fps)
            var meetings = calculateAllMeetings2(seconds_total, info.fps)
            redrawAllMeetingsBars(data, meetings, info, threshold)
        }
        ant_seconds_total = seconds_total
    })
    d3.select('#clear_all_meetings').on('click', function () {
        // Just remove the allmeeting_bars group when you close the tab/layer (it will still be implemented)
        // all_meetings will be empty when you close the tab/layer (it will still be implemented)
        d3.select('#allmeetings_bars').style('display', 'none')
        // Uncheck the checkboxes on y-axis
        for (i in labels) {
            if (document.getElementById(labels[i]).checked) {
                document.getElementById(labels[i]).checked = false
            }
        }
    })
}

function showMeetings(data) {
    d3.select('#meetings').on('click', function () {
        labels_checked = []
        // Object labels without repetition
        var labels = uniqueLabels(data)

        // Depois: Mudar id das checkboxes
        for (i in labels) {
            if (document.getElementById(labels[i]).checked) {
                labels_checked.push(labels[i])
            }
        }

        //----------------Adiciona no gráfico as barras correspondentes aos encontros---------------------------------
        if (labels_checked.length != 0) {
            // Get the meeting time
            var minutes = frame.$('#minutes').value
            var seconds = frame.$('#seconds').value
            var seconds_total = minutes * 60 + seconds
            // Return meetings from selected objects
            var meetings = calculateMeetings(labels_checked, seconds_total, info.fps)
            var labels_checked_string = labels_checked.toString()
            labels_checked_string = labels_checked_string.replace(',', '_')
            drawMeetingsBars(labels_checked, data, meetings, `meetings_${labels_checked_string}`)

        }
        else {
            alert('Select at least one object to view the meetings.')
        }

    })
    d3.select('#clear_meetings').on('click', function () {
        // Remove the meetings_bars group
        d3.select('#meetings_bars').remove()
        d3.select('#meetings_marker').remove()
        // Turns the meetings_bars group invisible to the user (think about it)
        //d3.select('#meetings_bars').style('display', 'none')
        // Uncheck the checkboxes on y-axis
        for (i in labels) {
            if (document.getElementById(labels[i]).checked) {
                document.getElementById(labels[i]).checked = false
            }
        }
    })
}

// Create the object types dropdown checkboxes
function createCheckboxOnFrame(label, id, prefix) {
    var checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.name = "checkbox_" + label
    checkbox.className = "label-checkbox"
    checkbox.id = prefix + label
    var object_label = document.createElement('label')
    object_label.htmlFor = label
    object_label.appendChild(document.createTextNode(label))
    var br = document.createElement('br')
    var checkbox_div = frame.$('#' + id)
    checkbox_div.appendChild(checkbox)
    checkbox_div.appendChild(object_label)
    checkbox_div.appendChild(br)
}

var object_types = []
// Create the Object Types Dropdown on JSFrame
function createObjectTypesDropdownOnFrame(data) {
    labels = uniqueLabels(data)
    for (var i in labels) {
        var object_type = labels[i].split(/[0-9]/)[0]
        if (!object_types.includes(object_type))
            object_types.push(object_type)
    }
    //console.log(object_types)

    object_types_hierarchical = []
    for (var i in object_types) {
        object_types_hierarchical.push([])
        object_types_hierarchical[i].push(object_types[i])
        object_types_hierarchical[i].push([])
        for (var j in labels) {
            if (labels[j].includes(object_types[i])) {
                object_types_hierarchical[i][1].push(labels[j])
            }
        }
    }
    // Create the hierarchical dropdown
    for (var i in object_types_hierarchical) {
        createCheckboxOnFrame(object_types_hierarchical[i][0], 'checkboxes_object_types', 'object_type_')
        var checkbox_div = frame.$('#checkboxes_object_types')
        var div = document.createElement('div')
        div.id = 'div_object_type_' + object_types_hierarchical[i][0]
        checkbox_div.appendChild(div)
    }
}

// Function to show or hide the object types dropdown
var expanded = false;
function showDropdown() {
    var checkboxes = frame.$("#checkboxes_object_types");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

// Function to see the object types filter or clear the filter
function seeObjectTypesFilterOnFrame() {
    frame.on('#object_type_filter', 'click', (_frame, evt) => {
        object_types_checked = []
        for (var i in object_types) {
            type_id = 'object_type_' + object_types[i]
            if (document.getElementById(type_id).checked) {
                object_types_checked.push(object_types[i])
            }
        }
        //console.log(object_types_checked)

        var bars_group = d3.select('#objects_bars')

        // Change group classes acording to selection
        bars_group.selectAll('g')
            .classed('bars-invisible', (d, i) => {
                //console.log(d, i)
                str_label = d.key
                for (var j in object_types_checked) {
                    if (str_label.includes(object_types_checked[j])) {
                        return false
                    }
                }
                return true
            })
            .classed('bars-visible', (d, i) => {
                //console.log(d, i)
                str_label = d.key
                for (var j in object_types_checked) {
                    if (str_label.includes(object_types_checked[j])) {
                        return true
                    }
                }
                return false
            })
    })
    frame.on('#clear_object_type_filter', 'click', (_frame, evt) => {
        var temporal_visualization = d3.select('.temporal-visualization')
        var bars_group = temporal_visualization.select('.bars')
        // Set all groups classes to bars-visible
        bars_group.selectAll('g')
            .attr('class', 'bars-visible')
    })
}

// Function to action when you click on the selector
function sortSelectorActionOnFrame(data) {
    frame.on('#selector_sort', 'change', (_frame, evt) => {
        var data_sorted = sortBars(frame.$('#selector_sort').value, data)
        showSpeed(data_sorted)
        showAllMeetings(data_sorted)
        showMeetings(data_sorted)
    })
}

function ShowStatistics(data) {
    d3.select('#show_statistics').on('click', function () {
        var meetings = calculateAllMeetings(0, info.fps)
        console.log(meetings)

        var labels = uniqueLabels(data)

        //Group the meeting bars belonging to the same object
        var nested_meetings = []
        nested_meetings = d3.nest()
            .key(function (d) { return d.label })
            .entries(meetings)
        console.log(nested_meetings)

        var meetings_time_table = []
        var meeted_objects = []
        for (i in labels) {
            meetings_time_table.push([])
            meeted_objects.push([])
            for (j in labels) {
                meetings_time_table[i].push(0)
            }
        }
        console.log(meetings_time_table)
        console.log(meeted_objects)

        for (i in nested_meetings) {
            console.log(nested_meetings[i])
            for (j in nested_meetings[i].values) {
                for (k in nested_meetings[i].values[j].object) {
                    x = labels.indexOf(nested_meetings[i].key)
                    y = labels.indexOf(nested_meetings[i].values[j].object[k])
                    meetings_time_table[x][y] += Number(nested_meetings[i].values[j].finish) - Number(nested_meetings[i].values[j].start)
                    meeted_objects[x].push(nested_meetings[i].values[j].object[k])
                }
            }
        }
        console.log(meetings_time_table)
        console.log(meeted_objects)

        var html_string = `<table style="width:380px; height:270px; font-size: 12px; text-align: center;"> `
        var len = labels.length + 1
        html_string += `<th style="background-color: #eee;" colspan="${len}">Meetings total time between the objects in seconds</th>`
        html_string += `<tr> <th>Objects</th>`
        for (i in labels) {
            html_string += `<th>${labels[i]}</th>`
        }
        html_string += '</tr>'

        for (i in meetings_time_table) {
            html_string += ` <tr> <th>${labels[i]}</th>`
            for (j in meetings_time_table[i]) {
                var seconds = meetings_time_table[i][j] / info.fps
                html_string += `<td> ${parseFloat(seconds.toFixed(2))} </td> `
            }
            html_string += `</tr> `
        }
        html_string += `</table> \n`

        html_string += `<table style="width:380px; height:270px; font-size: 12px; text-align: center;"> `
        html_string += `<th style="background-color: #eee;" colspan="2">Number of distinct objects that an object meeted</th>`
        for (i in labels) {
            // Get the objects meeted without repetition
            var unique = meeted_objects[i].filter((el, i, arr) => arr.indexOf(el) == i)
            html_string += `<tr> <th style="width:50%">${labels[i]}</th> <td>${unique.length}</td> </tr>`
        }
        html_string += `</table>`

        const frame_statistics = jsFrame.create({
            title: 'Stastitics',
            left: 20, top: 20, width: 400, height: 600,
            movable: true,//Enable to be moved by mouse
            resizable: true,//Enable to be resized by mouse
            html: html_string
        })

        frame_statistics.show()

    })
}