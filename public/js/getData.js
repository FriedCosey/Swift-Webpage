$(function(){
    let url = "http://192.168.2.100:8080/";
    let account;
    let containerDom = $('#containers > span');
    let containerRes;
    let container;
    let objectRes;
    $('#account input').on('change', function() {
        account = ($('input[name=accountName]:checked', '#account').val()); 
        $.get("/api/container?name="+account, function(data, status){
            console.log(data);
            containerRes = data.split("\n");
            $('#containers').children().remove();
            $('#objects').children().remove();
            for(let i = 0; i < containerRes.length - 1; i++){
                //$('#bontainers').append("<input type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                
                $('#containers').append('<label class="radio-label" id="' + containerRes[i] + '"></label>');
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<input name='containerName' type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<span class='inner-label'>" + containerRes[i] + "&nbsp&nbsp&nbsp&nbsp&nbsp</span>");
            }
        });
    });
    $('#containers').on('change', 'input[name=containerName]:radio', function() {
        container = ($('input[name=containerName]:checked', '#containers').val()); 
        $.get("/api/object?name="+account+"&container="+container, function(data, status){
            console.log(data);
            objectRes = data.split("\n");
            $('#objects').children().remove();
            for(let i = 0; i < objectRes.length - 1; i++){
                /*$('#objects').append($('<input />', {
                    'type': 'radio',
                    'name': 'objectName',
                    'id':   i,
                    'value': objectRes[i],
                }));*/
                //$('#objects').append('<label for="' + i + '">' + " " + objectRes[i] + " " + '</label><br>');
                $('#objects').append("<a class='objs' target='_blank' href=" + url + "v1/" + account + "/" + container + "/" + objectRes[i] + ">" + objectRes[i] + "</a>");
            }
        });
    });
    let addConName;
    let delConName;
    $('#delCon').on('click', function(){
        delConName = $('#delConN').text();
        $.get("/api/container/delete?name="+account+"&container="+delConName, function(data, status){
            updateContainer();
        });
    });

    $('#addCon').on('click', function(){
        addConName = $('#addConN').text();
        $.get("/api/container/create?name="+account+"&container="+addConName, function(data, status){
            updateContainer();
        });

    });


    let object;

    /*$('#objects').on('change', 'input[name=objectName]:radio', function() {
        object = ($('input[name=objectName]:checked', '#objects').val()); 
        $.get("/api/object/download?name="+account+"&container="+container+"&object="+object, function(data, status){

        });
    });*/
                

function updateContainer(){

        $.get("/api/container?name="+account, function(data, status){
            console.log(data);
            containerRes = data.split("\n");
            $('#containers').children().remove();
            $('#objects').children().remove();
            for(let i = 0; i < containerRes.length - 1; i++){
                //$('#bontainers').append("<input type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                
                $('#containers').append('<label class="radio-label" id="' + containerRes[i] + '"></label>');
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<input name='containerName' type='radio' id='" + containerRes[i] + "' value='" + containerRes[i] +  "'/>");
                $("#containers label:nth-child(" + (i+1) + ")" ).append("<span class='inner-label'>" + containerRes[i] + "&nbsp&nbsp&nbsp&nbsp&nbsp</span>");
            }
        });

}

});
