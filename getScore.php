<?php
$file = fopen("scores.txt", "r");
if (flock($file, LOCK_SH)) {
    echo fgets($file);
    flock($file, LOCK_UN);
    fclose($file);
}
else {
    flock($file, LOCK_UN);
    fclose($file);
    echo "false";
}
?>