var items1 = items

function sortBars (selected_value, original_data){
    // Remove meetings_bars, allmeetings_bars e speed_bars if it's needed
    var verify = d3.select('#meetings_bars')
    if (verify._groups[0][0] != null){
        verify.remove()
    }
    verify = d3.select('#allmeetings_bars')
    if (verify._groups[0][0] != null){
        var flag_allmeetings = 1
        //var display_allmeetings = d3.select('#allmeetings_bars').style('display')
        verify.remove()
    }
    verify = d3.select('#speed_bars')
    if (verify._groups[0][0] != null){
        verify.remove()
    }
    switch(selected_value){
        case '1':
            items1 = items
            //console.log(items1)
            drawSortBars(original_data, info)
            break
        case '2':
            var sorted_data = sort_longest_time_permanence(original_data)
            drawSortBars(sorted_data, info)
            break
        case '3':
            var sorted_data = sort_highest_meetings_number(original_data, info.fps)
            drawSortBars(sorted_data, info)
            break
        case '4':
            var sorted_data = sort_longest_meetings_duration(original_data, info.fps)
            drawSortBars(sorted_data, info)
            break
        case '5':
            var sorted_data = sort_highest_number_met_objects(original_data, info.fps)
            drawSortBars(sorted_data, info)
            break
    }
    if (flag_allmeetings == 1){
        var meetings = calculateAllMeetings(ant_seconds_total, info.fps)
        drawAllMeetingsBars(sorted_data, meetings, info.fps)
        //if(display_allmeetings == 'none')
            d3.select('#allmeetings_bars').style('display', 'none')
    }
    if(selected_value == 1){
        return original_data
    } else{
        return sorted_data
    }
}

function sort_longest_time_permanence (data){
    var sorted_data = []

    //Group the new bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
            .key(function(d){return d.label})
            .entries(data)
    //console.log(nested_data)
    //console.log(items)

    var array_to_sort = []
    var items_to_sort = []

    for(var i in nested_data){
        var iframes = 0
        for (var j in nested_data[i].values){
            iframes += nested_data[i].values[j].finish - nested_data[i].values[j].start + 1
            //console.log(nested_data[i].values[j])
        }
        array_to_sort.push({frames: iframes, values: nested_data[i].values})
        items_to_sort.push({label: items[i].label, frames: iframes, values: items[i].trajectory})
        //array_to_sort.push({frames: iframes, values: nested_data[i].key})
        //console.log(iframes)
    }


    // Sorts nested_array in descending order according to the number of frames
    array_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.frames) < Number(b.frames)){
            comparison = 1
        } else if (Number(a.frames) > Number(b.frames)){
            comparison = -1
        }
        return comparison
    }) 
    //console.log(array_to_sort)

    // Sorts items in descending order according to the number of frames
    items_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.frames) < Number(b.frames)){
            comparison = 1
        } else if (Number(a.frames) > Number(b.frames)){
            comparison = -1
        }
        return comparison
    })
    //console.log(items_to_sort)

    for (var i in array_to_sort){
        for (var j in array_to_sort[i].values){
            sorted_data.push(array_to_sort[i].values[j])
        }
    }

    var sorted_items = []
    for (var i in items_to_sort){
        sorted_items.push({label: items_to_sort[i].label, trajectory: items_to_sort[i].values})
    }
    console.log(sorted_items)
    items1 = sorted_items

    console.log(sorted_data)
    return sorted_data
}

function sort_highest_meetings_number (data, fps){
    var minutes = frame.$('#minutes').value
    var seconds = frame.$('#seconds').value
    var seconds_total = minutes * 60 + seconds
    var sorted_data = []
    var meetings = calculateAllMeetings(seconds_total, fps)
    var meetings_unique = meetings
    //console.log(meetings_unique)

    var meetings_numbers = []
    meetings_numbers.push([])
    meetings_numbers.push([])
    for (var i in meetings_unique){
        var index = meetings_numbers[0].indexOf(meetings_unique[i].label)
        if( index == -1) {
            meetings_numbers[0].push(meetings_unique[i].label)
            meetings_numbers[1].push(1)
        } else {
            meetings_numbers[1][index] += 1
        }
    }
    //console.log(meetings_numbers)

    //Group the bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
            .key(function(d){return d.label})
            .entries(data)
    //console.log(nested_data)

    var array_to_sort = []
    var items_to_sort = []

    for(var i in nested_data){
        for (var j in meetings_numbers[0]){
            var find = 0
            //console.log(`${nested_data[i].key, meetings_numbers[j][0]}`)
            if(nested_data[i].key == meetings_numbers[0][j]){
                array_to_sort.push({meetings: meetings_numbers[1][j], values: nested_data[i].values})
                items_to_sort.push({label: items[i].label, meetings: meetings_numbers[1][j], values: items[i].trajectory})
                //array_to_sort.push({meetings: meetings_numbers[1][j], object: nested_data[i].key})
                find = 1
                break
            }
            //console.log(nested_data[i].values[j])
        }
        if (find == 0){
            array_to_sort.push({meetings: 0, values: nested_data[i].values})
            items_to_sort.push({label: items[i].label, meetings: 0, values: items[i].trajectory})
            //array_to_sort.push({meetings: meetings_numbers[1][j], object: nested_data[i].key})
        }
    }
    //console.log(array_to_sort)
    //console.log(items_to_sort)

    // Sorts nested_array in descending order according to the number of frames
    array_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.meetings) < Number(b.meetings)){
            comparison = 1
        } else if (Number(a.meetings) > Number(b.meetings)){
            comparison = -1
        }
        return comparison
    }) 
    //console.log(array_to_sort)

    // Sorts items in descending order according to the number of meetings
    items_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.meetings) < Number(b.meetings)){
            comparison = 1
        } else if (Number(a.meetings) > Number(b.meetings)){
            comparison = -1
        }
        return comparison
    })
    //console.log(items_to_sort)

    for (var i in array_to_sort){
        for (var j in array_to_sort[i].values){
            sorted_data.push(array_to_sort[i].values[j])
        }
    }

    var sorted_items = []
    for (var i in items_to_sort){
        sorted_items.push({label: items_to_sort[i].label, trajectory: items_to_sort[i].values})
    }
    //console.log(sorted_items)
    items1 = sorted_items
    //console.log(items1)
    //console.log(sorted_data)
    return sorted_data
}

function sort_longest_meetings_duration(data, fps){
    var minutes = frame.$('#minutes').value
    var seconds = frame.$('#seconds').value
    var seconds_total = minutes * 60 + seconds
    var sorted_data = []
    var meetings = calculateAllMeetings(seconds_total, fps)
    var meetings_unique = meetings
    //console.log(meetings_unique)

    var meetings_duration = []
    meetings_duration.push([])
    meetings_duration.push([])
    for (var i in meetings_unique){
        var index = meetings_duration[0].indexOf(meetings_unique[i].label)
        if( index == -1) {
            meetings_duration[0].push(meetings_unique[i].label)
            meetings_duration[1].push(meetings_unique[i].finish - meetings_unique[i].start + 1)
        } else {
            meetings_duration[1][index] += meetings_unique[i].finish - meetings_unique[i].start + 1
        }
    }
    //console.log(meetings_duration)

    //Group the bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
            .key(function(d){return d.label})
            .entries(data)
    //console.log(nested_data)

    var nested_meetings = d3.nest()
            .key(function(d){return d.label})
            .entries(meetings_unique)
    //console.log(nested_meetings)

    var array_to_sort = []
    var items_to_sort = []

    for(var i in nested_data){
        var find = 0
        for (var j in meetings_duration[0]){
            if(nested_data[i].key == meetings_duration[0][j]){
                array_to_sort.push({meetings: meetings_duration[1][j], values: nested_data[i].values})
                items_to_sort.push({label: items[i].label, meetings: meetings_duration[1][j], values: items[i].trajectory})
                find = 1
                break
            }
            //console.log(nested_data[i].values[j])
        }
        if (find == 0){
            array_to_sort.push({meetings: 0, values: nested_data[i].values})
            items_to_sort.push({label: items[i].label, meetings: 0, values: items[i].trajectory})
        }
    }
    console.log(array_to_sort)
    console.log(items_to_sort)

    // Sorts nested_array in descending order according to the number of frames
    array_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.meetings) < Number(b.meetings)){
            comparison = 1
        } else if (Number(a.meetings) > Number(b.meetings)){
            comparison = -1
        }
        return comparison
    }) 
    console.log(array_to_sort)

    // Sorts items in descending order according to the number of frames
    items_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.meetings) < Number(b.meetings)){
            comparison = 1
        } else if (Number(a.meetings) > Number(b.meetings)){
            comparison = -1
        }
        return comparison
    }) 
    console.log(items_to_sort)

    for (var i in array_to_sort){
        for (var j in array_to_sort[i].values){
            sorted_data.push(array_to_sort[i].values[j])
        }
    }

    // items1 ordenado de acordo com os objetos com maior tempo em encontros
    var sorted_items = []
    for (var i in items_to_sort){
        sorted_items.push({label: items_to_sort[i].label, trajectory: items_to_sort[i].values})
    }
    console.log(sorted_items)
    items1 = sorted_items

    //console.log(sorted_data)
    return sorted_data
}

function sort_highest_number_met_objects(data, fps){
    var minutes = frame.$('#minutes').value
    var seconds = frame.$('#seconds').value
    var seconds_total = minutes * 60 + seconds
    var sorted_data = []
    var meetings = calculateAllMeetings(seconds_total, fps)
    console.log(meetings)

    var meetings_objects = []
    meetings_objects.push([])
    meetings_objects.push([])
    for (var i in meetings){
        var index = meetings_objects[0].indexOf(meetings[i].label)
        if( index == -1) {
            meetings_objects[0].push(meetings[i].label)
            meetings_objects[1].push([])
            if (typeof(meetings[i].object) == 'string') {
                //console.log(typeof(meetings[i].object))
                meetings_objects[1][meetings_objects[0].indexOf(meetings[i].label)].push(meetings[i].object)
            } else{
                for (var j in meetings[i].object){
                    meetings_objects[1][meetings_objects[0].indexOf(meetings[i].label)].push(meetings[i].object[j])
                }
            }
        } else {
            if (typeof(meetings[i].object) == 'string'){
                meetings_objects[1][index].push(meetings[i].object)
            } else {
                for (var j in meetings[i].object){
                    if(meetings_objects[1][index].indexOf(meetings[i].object[j]) == -1)
                        meetings_objects[1][index].push(meetings[i].object[j])
                }
            }
            
        }
    }
    console.log(meetings_objects)

    
    //Group the bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
            .key(function(d){return d.label})
            .entries(data)
    //console.log(nested_data)

    var array_to_sort = []
    var items_to_sort = []

    for(var i in nested_data){
        for (var j in meetings_objects[0]){
            var find = 0
            //console.log(`${nested_data[i].key, meetings_numbers[j][0]}`)
            if(nested_data[i].key == meetings_objects[0][j]){
                array_to_sort.push({meetings: meetings_objects[1][j].length, values: nested_data[i].values})
                items_to_sort.push({label: items[i].label, meetings: meetings_objects[1][j].length, values: items[i].trajectory})
                //array_to_sort.push({meetings: meetings_numbers[1][j], object: nested_data[i].key})
                find = 1
                break
            }
            //console.log(nested_data[i].values[j])
        }
        if (find == 0){
            array_to_sort.push({meetings: 0, values: nested_data[i].values})
            items_to_sort.push({label: items[i].label, meetings: 0, values: items[i].trajectory})
            //array_to_sort.push({meetings: meetings_numbers[1][j], object: nested_data[i].key})
        }
    }
    //console.log(array_to_sort)
    //console.log(items_to_sort)

    // Sorts nested_array in descending order according to the number of frames
    array_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.meetings) < Number(b.meetings)){
            comparison = 1
        } else if (Number(a.meetings) > Number(b.meetings)){
            comparison = -1
        }
        return comparison
    }) 
    //console.log(array_to_sort)

    // Sorts items in descending order according to the number of meetings
    items_to_sort.sort((a, b) => {
        var comparison = 0
        if (Number(a.meetings) < Number(b.meetings)){
            comparison = 1
        } else if (Number(a.meetings) > Number(b.meetings)){
            comparison = -1
        }
        return comparison
    })
    console.log(items_to_sort)

    for (var i in array_to_sort){
        for (var j in array_to_sort[i].values){
            sorted_data.push(array_to_sort[i].values[j])
        }
    }

    var sorted_items = []
    for (var i in items_to_sort){
        sorted_items.push({label: items_to_sort[i].label, trajectory: items_to_sort[i].values})
    }
    console.log(sorted_items)
    items1 = sorted_items
    console.log(items1)
    //console.log(sorted_data)
    
    return sorted_data
}