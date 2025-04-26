<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Rejected</title>
</head>     
<body>
    <div style="padding: 20px;">
        <p style="font-size: 13px; color: #333; margin: 0;">Hello, this is to inform you that your account: </p>
        <h2 style="background-color: #ccdaff; padding: 10px; border-radius: 5px; margin-top: -5px;">{{ $data }}</h2>
        <p style="font-size: 13px; margin-top: -10px; color: #333">has been rejected due to {{ $reject_message }}.</p>
        <p style="font-size: 11px; margin-top: 10px; color: #333; font-style: italic;">This is an automated email from DOCSIFY - Document Request System, please do not reply.</p>
    </div>
</body>
</html>         