/* async function testData(labels){
    console.log(labels)
    var string = '{'
    for (var i in labels){
        if (i == labels.length-1){
            string +=  `"${labels[i]}":"${labels[i]}}"`
            break
        }
        string +=  `"${labels[i]}":"${labels[i]}", `
    }
    console.log(string)
    var new_labels = JSON.parse(string)
    console.log(typeof(new_labels))
    //console.log(new_labels)
} */