jQuery(document).ready(function(){

    var select = $("select#color");

    select.change(function(){
        var select_name = $(this).children("option:selected").text();
        $(this).siblings("label").text(select_name);
    });
});