
xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.body.innerHTML=xmlhttp.responseText;
    console.log(xmlhttp.responseText);
    }
  };
xmlhttp.open("GET","spacegame.txt",true);
xmlhttp.send();