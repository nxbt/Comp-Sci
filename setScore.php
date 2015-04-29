<?php
$file = fopen("scores.txt", "c");
if (flock($file, LOCK_EX)) {
    ftruncate($file, 0);
    fwrite($file, $_POST["input"]);
    flock($file, LOCK_UN);
    fclose($file);
    echo "true";
}
else {
    fclose($file);
    flock($file, LOCK_UN);
    echo "false";
}
?>