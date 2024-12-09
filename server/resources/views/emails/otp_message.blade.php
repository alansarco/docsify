<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password OTP</title>
</head>     
<body>
    <div style="padding: 20px;">
        <h1 style="text-align: center; color: #333">Reset Account Password!</h1>
        <p style="font-size: 13px; color: #333; margin: 0;">Hello, it seems that you're trying to reset your password.</p>
        <p style="font-size: 13px; color: #333; margin-top: 5px;">We've sent you an OTP (One-Time Password) to complete the process securely. Please use the following OTP code:</p>
        <h2 style="background-color: #ccdaff; padding: 10px; border-radius: 5px; margin-top: -5px;">code: {{ $otp }}</h2>
        <p style="font-size: 13px; margin-top: -10px; color: #333">Please note that this OTP is valid for a limited time (5 minutes) and should not be shared with anyone.</p>
        <p style="font-size: 11px; margin-top: 10px; color: #333; font-style: italic;">This is an automated email from Brgy Central Bicutan Profiling System, please do not reply.</p>
    </div>
</body>
</html>         