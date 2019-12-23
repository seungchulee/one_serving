window.onload=function(){
var inputs = document.getElementsByClassName('checkbox-btn')

 for (var i=0; i < inputs.length; i++) {
    inputs[i].onchange = function() {

        var add = this.value.split("/")[0] * (this.checked ? 1 : -1);
        var new_total = parseFloat(document.getElementById('output').value);
        var updated_total = document.getElementById('output').value=new_total + add
        document.getElementById('total-cost-inner').innerHTML = updated_total;
        document.getElementById('tosubmit').innerHTML = updated_total;
    }
  }
}
