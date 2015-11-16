<?php
header('Content-type: application/json');

function getMimetype ($name)
{
	$finfo = finfo_open(FILEINFO_MIME_TYPE);
	$return = finfo_file($finfo, $name);
	finfo_close($finfo);

	if ($return === 'application/octet-stream') {
		$size = filesize($name);
		if ($size > 12) {
			$fp = fopen($name, 'r');
			$check1 = fread($fp, 4);
			fseek($fp, 8);
			$check2 = fread($fp, 4);

			fclose($fp);

			if (($check1 === 'RIFF') && (($check2 === 'WEBP'))) {
				$return = 'image/webp';
			}
		}
	}

	return $return;
}

$files = [];
foreach (new DirectoryIterator(__DIR__) as $fileInfo) {
	$fileName = $fileInfo->getFilename();
	if (substr($fileName, 0, 1) === '.') {
		continue;
	}
	$files[] = [
		'name' => $fileName,
		'size' => $fileInfo->getSize(),
		'mime' => getMimetype(__DIR__ . '/' . $fileName),
		'modified' => $fileInfo->getCTime(),
	];
}

$json = json_encode($files, JSON_PRETTY_PRINT);;

$json = preg_replace('/^    |\G    /m', "\t", $json);
echo $json;
