var max_speed = 0

function calculateSpeed(data, seconds_total){
    var fps = info.fps
    //console.log(data)
    var nested_data = []
    nested_data = d3.nest()
            .key(function(d){return d.label})
            .entries(data)
    //console.log(nested_data)
    
    // Obs.: items em calculate_meetings.js
    var objects_coordinates = []
    objects_coordinates = d3.nest()
            .key(function(d){return d.label})
            .entries(items1)
    //console.log(items)
    //console.log(items1)
    console.log(objects_coordinates)

    var objects_speed = []
    var pass = seconds_total * fps

    for (var i in nested_data){
        var aux = 0 // para percorrer as coordenadas da trajetória
        console.log(i)
        for (var j in nested_data[i].values){
            //console.log(nested_data[i].key, j)
            for (var k = nested_data[i].values[j].start; k < nested_data[i].values[j].finish; k = k + pass){
                var distance = 0
                if (nested_data[i].values[j].finish - k >= pass){
                    // índices que foram perrcorridos nas em objects_coordinates[i].values[j].trajectory
                    //console.log('indices')
                    //console.log(`${aux} até ${aux + pass}`)
                    //console.log('frames')
                    //console.log(`${k} até ${k + pass}`)
                    for (var l = aux+1; l <= aux+pass; l++){
                        l = Math.trunc(l)
                        //console.log(objects_coordinates[i].values[0].trajectory[l].frame)
                        var x = objects_coordinates[i].values[0].trajectory[l].cx - objects_coordinates[i].values[0].trajectory[l-1].cx
                        var y = objects_coordinates[i].values[0].trajectory[l].cy - objects_coordinates[i].values[0].trajectory[l-1].cy
                        if (x < 0){
                            x = x * -1
                        }
                        if (y < 0){
                            y *= -1
                        }
                        distance += Math.sqrt(x**2 + y**2)

                    }
                    var obj_speed = distance / seconds_total
                    //console.log(`Distancia: ${distance}`)
                    //console.log(`Velocidade: ${obj_speed}`)
                    if(obj_speed > max_speed){
                        max_speed = obj_speed
                    }
                    objects_speed.push({label: nested_data[i].key, start: k, finish: k+pass, meeting: 0, speed: obj_speed})
                    //console.log('\n')
                    aux += pass
                    
                } else{
                    // índices que foram perrcorridos nas em objects_coordinates[i].values[j].trajectory
                    //console.log('indices')
                    //console.log(`${aux} até ${aux + nested_data[i].values[j].finish - k}`)
                    //console.log('frames')
                    //console.log(`${k} até ${nested_data[i].values[j].finish}`)
                    for(var l = aux+1; l <= aux + nested_data[i].values[j].finish - k; l++){
                        l = Math.trunc(l)
                        //console.log(objects_coordinates[i].values[0].trajectory[l].frame)
                        var x = objects_coordinates[i].values[0].trajectory[l].cx - objects_coordinates[i].values[0].trajectory[l-1].cx
                        var y = objects_coordinates[i].values[0].trajectory[l].cy - objects_coordinates[i].values[0].trajectory[l-1].cy
                        if (x < 0){
                            x = x * -1
                        }
                        if (y < 0){
                            y *= -1
                        }
                        distance += Math.sqrt(x**2 + y**2)
                    }
                    var aux_seconds = (nested_data[i].values[j].finish - k) / fps
                    //console.log(`aux_seconds: ${aux_seconds}`)
                    var obj_speed = distance / aux_seconds
                    //console.log(`Distancia: ${distance}`)
                    //console.log(`Velocidade: ${obj_speed}`)
                    if(obj_speed > max_speed){
                        max_speed = obj_speed
                    }
                    objects_speed.push({label: nested_data[i].key, start: k, finish: nested_data[i].values[j].finish, meeting: 0, speed: obj_speed})
                    //console.log('\n')
                    aux += nested_data[i].values[j].finish - k + 1
                    
                }
            }
        }
        //console.log('\n')
    }
    console.log(objects_speed)
    return objects_speed
}