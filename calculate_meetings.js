function array_intersection(array_a, array_b) {
    var _array = []
    for (let i in array_b) {
        //Se elemento do array b estivar no array a
        if (array_a.indexOf(array_b[i]) != -1) {
            //Se o elemento não existir no _array então adiciona
            //if (array_a.indexOf(array_b[i]) == -1){
            _array.push(array_b[i])
            //}
        }
    }
    return _array
}

var items = []
$.getJSON(`${files_path}detections.json`, function (data) {
    $.each(data, function (index, value) {
        items.push(value)
    })
})
//console.log(items)

function calculateMeetings(array, seconds_total, fps) {
    meetings = []
    /*
    --------------------------Um objeto selecionado------------------------------------------
    */
    if (array.length == 1) {
        //console.log(items)
        // Índice do objeto selecionado em items
        for (var i in items) {
            if (items[i].label == array[0]) {
                var index_checked_object = i
                break
            }
        }
        // checked_objects armazena todos os dados do objeto selecionado e do objeto com o qual será comparado
        //console.log(index_checked_object)
        var checked_objects = []
        checked_objects.push(items[index_checked_object])
        //console.log(checked_objects)
        var frames_checked_objects = []
        // Já adiciona os frames nos quais o obj selecionado apareceu
        frames_checked_objects.push([])
        for (var i = 0; i < checked_objects[0].trajectory.length; i++) {
            frames_checked_objects[0].push(checked_objects[0].trajectory[i].frame)
        }

        // Percorre todos os items para verificar se aparecem nos mesmos frames dos objetos selecionados com o objeto selecionado
        // Compara de dois em dois
        for (var i in items) {
            if (i != index_checked_object) {
                // Adiciona segundo item para compará-lo com o item selecionado
                checked_objects.push(items[i])
                // Adiciona frames do segundo item
                frames_checked_objects.push([])
                for (var j = 0; j < checked_objects[1].trajectory.length; j++) {
                    frames_checked_objects[1].push(checked_objects[1].trajectory[j].frame)
                }
                //Se houver intersecção de frames então verifica bouding boxes

                var frames_intersection_array = array_intersection(frames_checked_objects[0], frames_checked_objects[1])
                if (frames_intersection_array.length != 0) {
                    var checked_objects_coordinates = [] //array de arrays com as coordenadas do objeto nos frames onde todos selecionados aparecem
                    var intersection_frames = [] // array com os frames onde houve intersecção das bouding boxes dos dois objetos

                    // checked_objects_coordinates - Coordenadas dos dois objetos nos frames onde aparecem ao mesmo tempo
                    for (var k in checked_objects) {
                        checked_objects_coordinates.push([])
                        for (var j = 0; j < checked_objects[k].trajectory.length; j++) {
                            //console.log('checked_objects[i].trajectory[j]')
                            //console.log(checked_objects[i].trajectory[j])
                            //Intersecção dos frames - posições dos objetos nos frames onde aparecem os dois objetos ao mesmo tempo
                            if (frames_intersection_array.indexOf(checked_objects[k].trajectory[j].frame) != -1) {
                                checked_objects_coordinates[k].push({ frame: checked_objects[k].trajectory[j].frame, cx: checked_objects[k].trajectory[j].cx, cy: checked_objects[k].trajectory[j].cy, dx: checked_objects[k].trajectory[j].dx, dy: checked_objects[k].trajectory[j].dy })
                            }
                        }
                    }
                    //console.log(checked_objects_coordinates)

                    // Verifica se houve intersecção nas bounding boxes
                    var obj1_x_coordinates = []
                    var obj1_y_coordinates = []
                    var obj2_x_coordinates = []
                    var obj2_y_coordinates = []
                    for (var j in checked_objects_coordinates[0]) {
                        // Primeiro objeto
                        start_x = checked_objects_coordinates[0][j].cx - checked_objects_coordinates[0][j].dx
                        end_x = checked_objects_coordinates[0][j].cx + checked_objects_coordinates[0][j].dx
                        start_y = checked_objects_coordinates[0][j].cy - checked_objects_coordinates[0][j].dy
                        end_y = checked_objects_coordinates[0][j].cy + checked_objects_coordinates[0][j].dy
                        obj1_x_coordinates = d3.range(Math.floor(start_x), Math.floor(end_x))
                        obj1_y_coordinates = d3.range(Math.floor(start_y), Math.floor(end_y))
                        // Segundo objeto
                        start_x = checked_objects_coordinates[1][j].cx - checked_objects_coordinates[1][j].dx
                        end_x = checked_objects_coordinates[1][j].cx + checked_objects_coordinates[1][j].dx
                        start_y = checked_objects_coordinates[1][j].cy - checked_objects_coordinates[1][j].dy
                        end_y = checked_objects_coordinates[1][j].cy + checked_objects_coordinates[1][j].dy
                        obj2_x_coordinates = d3.range(Math.floor(start_x), Math.floor(end_x))
                        obj2_y_coordinates = d3.range(Math.floor(start_y), Math.floor(end_y))

                        x_intersection_result = array_intersection(obj1_x_coordinates, obj2_x_coordinates)
                        y_intersection_result = array_intersection(obj1_y_coordinates, obj2_y_coordinates)
                        if (x_intersection_result.length != 0 && y_intersection_result != 0) {
                            intersection_frames.push(checked_objects_coordinates[0][j].frame)
                        }
                    }

                    // Se o intersection_frames (armazena frames onde ocorreu encontros das bounding boxes) não estiver vazio
                    // Adiciona barras vermelhas ao meetings
                    if (intersection_frames.length != 0) {
                        for (var i in intersection_frames) {
                            if (i == 0) {
                                var sta = intersection_frames[i]
                                var fin = intersection_frames[i]
                            } else if (intersection_frames[i] == fin + 1) {
                                fin = intersection_frames[i]
                                if (i == intersection_frames.length - 1) {
                                    var meeting_total_frames = fin - sta + 1
                                    if (meeting_total_frames / fps >= seconds_total) {
                                        meetings.push({ label: checked_objects[0].label, start: sta, finish: fin, meeting: 1, object: [checked_objects[1].label] })
                                        meetings.push({ label: checked_objects[1].label, start: sta, finish: fin, meeting: 1, object: [checked_objects[0].label] })
                                    }

                                }

                            } else {
                                var meeting_total_frames = fin - sta + 1
                                if (meeting_total_frames / fps >= seconds_total) {
                                    meetings.push({ label: checked_objects[0].label, start: sta, finish: fin, meeting: 1, object: [checked_objects[1].label] })
                                    meetings.push({ label: checked_objects[1].label, start: sta, finish: fin, meeting: 1, object: [checked_objects[0].label] })
                                }
                                sta = intersection_frames[i]
                                fin = intersection_frames[i]
                            }
                        }
                    }
                    // Retira coordenadas do objeto comparado
                    checked_objects_coordinates.pop()
                }
                // Retira segundo objeto que está sendo comparado com o selecionado e os frames correspondentes a esse objeto
                checked_objects.pop()
                frames_checked_objects.pop()
            }
        }


    }
    /*
    --------------------------Mais de um objeto selecionado------------------------------------------
    */
    else {
        //console.log(array)
        //console.log(items)
        //Todos os dados dos objetos selecionados
        var checked_objects = []
        for (var i in array) {
            for (j in items) {
                if (items[j].label == array[i]) {
                    checked_objects.push(items[j])
                }
            }
        }
        //console.log(checked_objects)

        //Array com frames nos quais os objetos selecionados apareceram
        frames_checked_objects = []
        for (var i in checked_objects) {
            frames_checked_objects.push([])
            for (j in checked_objects[i].trajectory) {
                frames_checked_objects[i].push(checked_objects[i].trajectory[j].frame)
            }
        }
        //console.log(frames_checked_objects)

        //Frames onde todos os objetos apareceram (intersecção dos frames dos objetos selecionados)
        var aux_array = frames_checked_objects[0]
        var frames_intersection_array = []
        for (var i in array) {
            if (i == 0) {
                continue
            }
            //console.log(frames_checked_objects[i])
            frames_intersection_array = array_intersection(aux_array, frames_checked_objects[i])
            aux_array = frames_intersection_array
        }
        //console.log('Frames onde objetos aparecem')
        //console.log(frames_intersection_array)

        //Se o frames_intersection_array estiver vazio, os objetos não apareceram nos mesmos frames
        // Se os objetos não tem nenhum frame em comum, não há possibilidade de encontro então
        //Verificar se houve intersecção das bouding boxes nos frames em comum
        if (frames_intersection_array.length != 0) {
            //console.log('Aparecem nos mesmos frames')
            //console.log(frames_intersection_array)
            var checked_objects_coordinates = [] //array de arrays com as coordenadas do objeto nos frames onde todos selecionados aparecem
            var intersection_frames = [] // array com os frames onde houve intersecção das bouding boxes de todos objetos selecionados

            // checked_objects_coordinates
            for (var i in checked_objects) {
                checked_objects_coordinates.push([])
                for (var j = 0; j < checked_objects[i].trajectory.length; j++) {
                    //console.log('checked_objects[i].trajectory[j]')
                    //console.log(checked_objects[i].trajectory[j])
                    //Intersecção dos frames - posições dos objetos nos frames onde aparecem todos os objetos selecionados ao mesmo tempo
                    if (frames_intersection_array.indexOf(checked_objects[i].trajectory[j].frame) != -1) {
                        checked_objects_coordinates[i].push({ frame: checked_objects[i].trajectory[j].frame, cx: checked_objects[i].trajectory[j].cx, cy: checked_objects[i].trajectory[j].cy, dx: checked_objects[i].trajectory[j].dx, dy: checked_objects[i].trajectory[j].dy })
                    }
                }
            }
            //console.log('Coordenadas do objetos no frames onde eles aparecem ao mesmo tempo')
            //console.log(checked_objects_coordinates)

            // intersection_frames
            for (var j in checked_objects_coordinates[0]) {
                for (var i in checked_objects_coordinates) {
                    if (i == 0) {
                        start_x = checked_objects_coordinates[i][j].cx - checked_objects_coordinates[i][j].dx
                        end_x = checked_objects_coordinates[i][j].cx + checked_objects_coordinates[i][j].dx
                        start_y = checked_objects_coordinates[i][j].cy - checked_objects_coordinates[i][j].dy
                        end_y = checked_objects_coordinates[i][j].cy + checked_objects_coordinates[i][j].dy
                        x_intersection_result = d3.range(Math.floor(start_x), Math.floor(end_x))
                        y_intersection_result = d3.range(Math.floor(start_y), Math.floor(end_y))
                        continue
                    }
                    start_x = checked_objects_coordinates[i][j].cx - checked_objects_coordinates[i][j].dx
                    end_x = checked_objects_coordinates[i][j].cx + checked_objects_coordinates[i][j].dx
                    start_y = checked_objects_coordinates[i][j].cy - checked_objects_coordinates[i][j].dy
                    end_y = checked_objects_coordinates[i][j].cy + checked_objects_coordinates[i][j].dy
                    x_obj_coordinates = d3.range(Math.floor(start_x), Math.floor(end_x))
                    y_obj_coordinates = d3.range(Math.floor(start_y), Math.floor(end_y))
                    x_intersection_result = array_intersection(x_intersection_result, x_obj_coordinates)
                    y_intersection_result = array_intersection(y_intersection_result, y_obj_coordinates)
                }
                //console.log(x_intersection_result)
                //console.log(y_intersection_result)
                //console.log('\n')
                if (x_intersection_result.length != 0 && y_intersection_result != 0) {
                    intersection_frames.push(checked_objects_coordinates[0][j].frame)
                }
            }
            //console.log(intersection_frames)

            if (intersection_frames.length != 0) {
                for (var i in intersection_frames) {
                    if (i == 0) {
                        var sta = intersection_frames[i]
                        var fin = intersection_frames[i]
                    } else if (intersection_frames[i] == fin + 1) {
                        fin = intersection_frames[i]
                        if (i == intersection_frames.length - 1) {
                            var meeting_total_frames = fin - sta + 1
                            if (meeting_total_frames / fps >= seconds_total) {
                                //meetings.push({label: array[0], start: sta, finish: fin, meeting: 1, object: array[1]})
                                for (var j in array) {
                                    var objects_array = []
                                    for (var k in array) {
                                        if (k != j) {
                                            objects_array.push(array[k])
                                        }
                                    }
                                    meetings.push({ label: array[j], start: sta, finish: fin, meeting: 1, object: objects_array })
                                }
                            }
                        }

                    } else {
                        var meeting_total_frames = fin - sta + 1
                        if (meeting_total_frames / fps >= seconds_total) {
                            //meetings.push({label: array[0], start: sta, finish: fin, meeting: 1, object: array[1]})
                            for (var j in array) {
                                var objects_array = []
                                for (var k in array) {
                                    if (k != j) {
                                        objects_array.push(array[k])
                                    }
                                }
                                meetings.push({ label: array[j], start: sta, finish: fin, meeting: 1, object: objects_array })
                            }
                        }
                        sta = intersection_frames[i]
                        fin = intersection_frames[i]
                    }
                }
            }
        }
    }
    meetings = adjustMeetings(meetings)
    //console.log(meetings)
    return meetings
}

var all_meetings = [] // Variável global para que não seja preciso calcular todos os encontro de novo
function calculateAllMeetings(seconds_total, fps) {
    all_meetings = []
    //console.log(seconds_total)
    //console.log(items)
    for (var index_checked_object in items) {
        // checked_objects armazena todos os dados do objeto selecionado e do objeto com o qual será comparado
        //console.log(index_checked_object)
        var checked_objects = []
        checked_objects.push(items[index_checked_object])
        //console.log(checked_objects)
        var frames_checked_objects = []
        // Já adiciona os frames nos quais o obj selecionado apareceu
        frames_checked_objects.push([])
        for (var i = 0; i < checked_objects[0].trajectory.length; i++) {
            frames_checked_objects[0].push(checked_objects[0].trajectory[i].frame)
        }
        var next_index = Number(index_checked_object) + 1
        // Percorre todos os items para verificar se aparecem nos mesmos frames dos objetos selecionados com o objeto selecionado
        // Compara de dois em dois
        for (var i = next_index; i < Number(items.length); i++) {
            //console.log(i)
            // Adiciona segundo item para compará-lo com o item selecionado
            checked_objects.push(items[i])
            // Adiciona frames do segundo item
            frames_checked_objects.push([])
            for (var j = 0; j < checked_objects[1].trajectory.length; j++) {
                frames_checked_objects[1].push(checked_objects[1].trajectory[j].frame)
            }

            //Se houver intersecção de frames então verifica bouding boxes
            var frames_intersection_array = array_intersection(frames_checked_objects[0], frames_checked_objects[1])
            if (frames_intersection_array.length != 0) {
                var checked_objects_coordinates = [] //array de arrays com as coordenadas do objeto nos frames onde todos selecionados aparecem
                var intersection_frames = [] // array com os frames onde houve intersecção das bouding boxes dos dois objetos

                // checked_objects_coordinates - Coordenadas dos dois objetos nos frames onde aparecem ao mesmo tempo
                for (var k in checked_objects) {
                    checked_objects_coordinates.push([])
                    for (var j = 0; j < checked_objects[k].trajectory.length; j++) {
                        //console.log('checked_objects[i].trajectory[j]')
                        //console.log(checked_objects[i].trajectory[j])
                        //Intersecção dos frames - posições dos objetos nos frames onde aparecem os dois objetos ao mesmo tempo
                        if (frames_intersection_array.indexOf(checked_objects[k].trajectory[j].frame) != -1) {
                            checked_objects_coordinates[k].push({ frame: checked_objects[k].trajectory[j].frame, cx: checked_objects[k].trajectory[j].cx, cy: checked_objects[k].trajectory[j].cy, dx: checked_objects[k].trajectory[j].dx, dy: checked_objects[k].trajectory[j].dy })
                        }
                    }
                }
                //console.log(checked_objects_coordinates)

                // Verifica se houve intersecção nas bounding boxes
                var obj1_x_coordinates = []
                var obj1_y_coordinates = []
                var obj2_x_coordinates = []
                var obj2_y_coordinates = []
                for (var j in checked_objects_coordinates[0]) {
                    // Primeiro objeto
                    start_x = checked_objects_coordinates[0][j].cx - checked_objects_coordinates[0][j].dx
                    end_x = checked_objects_coordinates[0][j].cx + checked_objects_coordinates[0][j].dx
                    start_y = checked_objects_coordinates[0][j].cy - checked_objects_coordinates[0][j].dy
                    end_y = checked_objects_coordinates[0][j].cy + checked_objects_coordinates[0][j].dy
                    obj1_x_coordinates = d3.range(Math.floor(start_x), Math.floor(end_x))
                    obj1_y_coordinates = d3.range(Math.floor(start_y), Math.floor(end_y))
                    // Segundo objeto
                    start_x = checked_objects_coordinates[1][j].cx - checked_objects_coordinates[1][j].dx
                    end_x = checked_objects_coordinates[1][j].cx + checked_objects_coordinates[1][j].dx
                    start_y = checked_objects_coordinates[1][j].cy - checked_objects_coordinates[1][j].dy
                    end_y = checked_objects_coordinates[1][j].cy + checked_objects_coordinates[1][j].dy
                    obj2_x_coordinates = d3.range(Math.floor(start_x), Math.floor(end_x))
                    obj2_y_coordinates = d3.range(Math.floor(start_y), Math.floor(end_y))

                    x_intersection_result = array_intersection(obj1_x_coordinates, obj2_x_coordinates)
                    y_intersection_result = array_intersection(obj1_y_coordinates, obj2_y_coordinates)
                    if (x_intersection_result.length != 0 && y_intersection_result != 0) {
                        intersection_frames.push(checked_objects_coordinates[0][j].frame)
                    }
                }

                // Se o intersection_frames (armazena frames onde ocorreu encontros das bounding boxes) não estiver vazio
                // Adiciona barras vermelhas ao all_meetings
                if (intersection_frames.length != 0) {
                    for (var j in intersection_frames) {
                        if (j == 0) {
                            var sta = intersection_frames[j]
                            var fin = intersection_frames[j]
                        } else if (intersection_frames[j] == fin + 1) {
                            fin = intersection_frames[j]
                            if (j == intersection_frames.length - 1) {
                                var meeting_total_frames = fin - sta + 1
                                if (meeting_total_frames / fps >= seconds_total) {
                                    all_meetings.push({ label: checked_objects[0].label, start: sta, finish: fin, meeting: 1, object: checked_objects[1].label })
                                    all_meetings.push({ label: checked_objects[1].label, start: sta, finish: fin, meeting: 1, object: checked_objects[0].label })
                                }
                            }

                        } else {
                            var meeting_total_frames = fin - sta + 1
                            if (meeting_total_frames / fps >= seconds_total) {
                                all_meetings.push({ label: checked_objects[0].label, start: sta, finish: fin, meeting: 1, object: checked_objects[1].label })
                                all_meetings.push({ label: checked_objects[1].label, start: sta, finish: fin, meeting: 1, object: checked_objects[0].label })
                            }
                            sta = intersection_frames[j]
                            fin = intersection_frames[j]
                        }
                    }
                }
                // Retira coordenadas do objeto comparado
                checked_objects_coordinates.pop()
            }
            // Retira segundo objeto que está sendo comparado com o selecionado e os frames correspondentes a esse objeto
            checked_objects.pop()
            frames_checked_objects.pop()

        }
        checked_objects.pop()
    }

    //console.log('all_meetings inicial')
    //console.log(all_meetings)
    all_meetings = adjustMeetings(all_meetings)
    return all_meetings
}

/*
    ************* adjustMeetings() function *************

    This function is necessary because when we calculate the objects' meetings with the functions calculateMeetings() and calculateAllMeetings() the meetings are returned as follows:

    {label: "person6", start: 2, finish: 88, meeting: 1, object: "bicycle17"} 
    {label: "person6", start: 82, finish: 112, meeting: 1, object: "person30"}

    Each object corresponds to the meeting of an object with another object, however an object can meet with more than one object at the same time, so it is necessary to find out if the meeting involves more than one object in a certain period of time.
*/
function adjustMeetings(meetings) { // p.s. there is another way
    //Group the bars belonging to the same object
    var nested_data = []
    nested_data = d3.nest()
        .key(function (d) { return d.label })
        .entries(meetings)
    //console.log('all_meetings agrupado por objeto')
    //console.log(nested_data)

    var meetings_aux = []
    // Go through all the objects that present meetings
    for (var i in nested_data) {
        if (nested_data[i].values.length != 1) {
            // Get two arrays with all the objects' meetings smaller starts and bigger finishes
            var meetings_frames_start = []
            var meetings_frames_finish = []

            // Group the meeting bars corresponding to the same object
            var values_nested = d3.nest()
                .key(function (d) { return d.object })
                .entries(nested_data[i].values)
            //console.log('values_nested')
            //console.log(values_nested)

            for (var j in values_nested) {
                //console.log(values_nested[j])
                var start_aux = []
                var finish_aux = []
                for (var k in values_nested[j].values) {
                    start_aux.push(values_nested[j].values[k].start)
                    finish_aux.push(values_nested[j].values[k].finish)
                }
                meetings_frames_start.push(d3.min(start_aux))
                meetings_frames_finish.push(d3.max(finish_aux))

            }

            //console.log(nested_data[i].key) // Object that is being verified
            //console.log(meetings_frames_start)
            //console.log(meetings_frames_finish)

            // Get the minimum and maximum values that object's meetings bars can reach
            var min = d3.min(meetings_frames_start)
            var max = d3.max(meetings_frames_finish)

            // Verifies what object(s) belong to the meeting in a period of time and creates the meeting bar according to the time this/these object(s) met the object that is being verified
            var meeting_objects = []
            // Go through the minimum until the maximum value ​​that object's meetings bars can reach
            for (var j = min; j <= max; j++) {
                var previous_meeting_objects = [] // Objects belonging to previous j
                if (meeting_objects.length != 0) {
                    for (var l in meeting_objects) {
                        previous_meeting_objects.push(meeting_objects[l])
                    }
                }
                // p.s. k corresponds to the index of an object belonging to a meeting of the verified object
                for (var k in meetings_frames_start) {
                    // An object k can belong one or more meeting bars, this for() goes through all these bars
                    for (var l in values_nested[k].values) {
                        // if the object k is meeting with the verified object in the time j
                        if (j >= Number(values_nested[k].values[l].start) && j <= Number(values_nested[k].values[l].finish)) {
                            // if the object k is not in meeting_objects, add it in meeting_objects
                            var obj = values_nested[k].values[l].object
                            if (meeting_objects.length == 0) { // if meeting_objects is empty
                                //console.log('adicionou do meeting_objects')
                                meeting_objects.push(obj)
                            } else if (meeting_objects.indexOf(values_nested[k].values[l].object) == -1) { // if meeting_objects is not empty
                                //console.log('adicionou do meeting_objects')
                                meeting_objects.push(obj)
                            }
                            else {
                                //console.log('não faz nada')
                            }
                            // this break avoids to verify the same object again and remove it in the next else
                            break;
                        } else { // the object k doesn't meet the vefied object in the time j
                            // if the object k is in meeting_objects, remove it
                            if (meeting_objects.indexOf(values_nested[k].values[l].object) != -1) {
                                //console.log('j não está dentro de start e finish e o objeto está no meetings, então remove ')
                                meeting_objects.splice(meeting_objects.indexOf(values_nested[k].values[l].object), 1)
                            }
                        }
                    }
                }

                // Show when we have changes on the objects belonging to the meeting
                /* if (meeting_objects.toString() != previous_meeting_objects.toString()){
                    console.log(j)
                    console.log(meeting_objects)
                    console.log(previous_meeting_objects)
                } */

                // if previous_meeting_objects is empty, the start is j
                if (previous_meeting_objects.length == 0) {
                    var start = j
                }
                // if the meeting objects of the previous j (j-1) are diferent of the actual j meeting objects and j is bigger than start
                if (previous_meeting_objects.toString() != meeting_objects.toString() && j - 1 > start) {
                    // if there are no actual meeting objects and there are previous meeting objets then ends the previously bar
                    if (meeting_objects.length == 0 && previous_meeting_objects.length != 0) {
                        meetings_aux.push({ label: nested_data[i].key, start: start, finish: (j - 1), meeting: 1, object: previous_meeting_objects })
                        //console.log(meetings_aux[meetings_aux.length-1])
                        start = j
                    }
                    // if all the previous meeting objects are not in actual meeting objects and actual meeting_objects is not empty
                    // When some object is removed
                    else if (meeting_objects.toString().indexOf(previous_meeting_objects.toString()) == -1 && meeting_objects.length != 0) {
                        meetings_aux.push({ label: nested_data[i].key, start: start, finish: (j - 1), meeting: 1, object: previous_meeting_objects })
                        //console.log(meetings_aux[meetings_aux.length-1])
                        start = j - 1
                    }
                    // When some object is added
                    else {
                        meetings_aux.push({ label: nested_data[i].key, start: start, finish: (j), meeting: 1, object: previous_meeting_objects })
                        //console.log(meetings_aux[meetings_aux.length-1])
                        start = j
                    }

                }
                // p.s. this if create k objects because of the for(), meetings_aux_unique tries to fix it
                // if j is equal the max value that meetings bars can reach, so ends the current bar
                if (j == max) {
                    var obj = { label: nested_data[i].key, start: start, finish: j, meeting: 1, object: meeting_objects }
                    meetings_aux.push(obj)
                    //console.log(meetings_aux[meetings_aux.length-1])
                    //console.log('\n')
                }

            }

        } else {
            meetings_aux.push(nested_data[i].values[0])
        }
    }

    //console.log('\nmeetings_aux')
    //console.log(meetings_aux)
    return meetings_aux
}
