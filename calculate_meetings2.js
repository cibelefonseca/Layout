
function calculateAllMeetings2(seconds_total, fps, threshold){
    for(var index_checked_object in items){
        //checked_objects armazena todos os dados do objeto selecionado e do objeto com o qual será comparado
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
        //console.log(frames_checked_objects)
        var next_index = Number(index_checked_object) + 1
        // Percorre todos os items para verificar se aparecem nos mesmos frames dos objetos selecionados com o objeto selecionado
        // Compara de dois em dois
        for (var i = next_index; i < Number(items.length); i++){
            // Adiciona segundo item para compará-lo com o item selecionado
            checked_objects.push(items[i])
            // Adiciona frames do segundo item
            frames_checked_objects.push([])
            for (var j = 0; j < checked_objects[1].trajectory.length; j++){
                frames_checked_objects[1].push(checked_objects[1].trajectory[j].frame)
            }
            //Se houver intersecção de frames então verifica bouding boxes
            var frames_intersection_array = array_intersection(frames_checked_objects[0], frames_checked_objects[1])
            if (frames_intersection_array.length != 0){
                var checked_objects_coordinates = [] //array de arrays com as coordenadas do objeto nos frames onde todos selecionados aparecem
                var intersection_frames = [] // array com os frames onde houve intersecção das bouding boxes dos dois objetos
        
                // checked_objects_coordinates - Coordenadas dos dois objetos nos frames onde aparecem ao mesmo tempo
                for (var k in checked_objects){
                    checked_objects_coordinates.push([])
                    for (var j = 0; j < checked_objects[k].trajectory.length; j++){
                        //console.log('checked_objects[i].trajectory[j]')
                        //console.log(checked_objects[i].trajectory[j])
                        //Intersecção dos frames - posições dos objetos nos frames onde aparecem os dois objetos ao mesmo tempo
                        if (frames_intersection_array.indexOf(checked_objects[k].trajectory[j].frame) != -1){
                            checked_objects_coordinates[k].push({frame: checked_objects[k].trajectory[j].frame, cx: checked_objects[k].trajectory[j].cx, cy: checked_objects[k].trajectory[j].cy, dx: checked_objects[k].trajectory[j].dx, dy: checked_objects[k].trajectory[j].dy})
                        }
                    }
                }
                //console.log(checked_objects_coordinates)

                // Verifica se a distância dos centros das bounding boxes é menor que a soma das "hipotenusas" das bouding boxes multiplicada por um threshold
                //console.log(checked_objects_coordinates)
                for (var j in checked_objects_coordinates[0]){
                    //console.log(checked_objects_coordinates[0][j])
                    // First object
                    obj1_hypotenuse = Math.sqrt(parseFloat(checked_objects_coordinates[0][j].dx)^2 + parseFloat(checked_objects_coordinates[0][j].dy)^2)
                    // Second object
                    obj2_hypotenuse = Math.sqrt(parseFloat(checked_objects_coordinates[1][j].dx)^2 + parseFloat(checked_objects_coordinates[1][j].dy)^2)
                    // Distance between the two objects centers
                    distance_from_centers = Math.sqrt((parseFloat(checked_objects_coordinates[0][j].cx) - parseFloat(checked_objects_coordinates[1][j].cx))^2 + (parseFloat(checked_objects_coordinates[0][j].cy) - parseFloat(checked_objects_coordinates[1][j].cy))^2)
                    //console.log(distance_from_centers)
                    if(distance_from_centers <= (obj1_hypotenuse+obj2_hypotenuse)*threshold){
                        intersection_frames.push(checked_objects_coordinates[0][j].frame)
                    }
                }
                console.log(intersection_frames)
                // Se o intersection_frames (armazena frames onde ocorreu encontros das bounding boxes) não estiver vazio
                // Adiciona barras vermelhas ao all_meetings
                if (intersection_frames.length != 0){
                    for (var j in intersection_frames){
                        if (j == 0){
                            var sta = intersection_frames[j]
                            var fin = intersection_frames[j]
                        } else if (intersection_frames[j] == fin + 1){
                            fin = intersection_frames[j]
                            if (j == intersection_frames.length - 1){
                                var meeting_total_frames = fin - sta + 1
                                if(meeting_total_frames/fps >= seconds_total){
                                    all_meetings.push({label: checked_objects[0].label, start: sta, finish: fin, meeting: 1, object: checked_objects[1].label})
                                    all_meetings.push({label: checked_objects[1].label, start: sta, finish: fin, meeting: 1, object: checked_objects[0].label})
                                }
                            }
        
                        } else {
                            var meeting_total_frames = fin - sta + 1
                            if(meeting_total_frames/fps >= seconds_total){
                                all_meetings.push({label: checked_objects[0].label, start: sta, finish: fin, meeting: 1, object: checked_objects[1].label})
                                all_meetings.push({label: checked_objects[1].label, start: sta, finish: fin, meeting: 1, object: checked_objects[0].label})
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