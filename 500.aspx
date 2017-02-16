<script language="c#" runat="server">

    public void Page_Load(object sender, EventArgs e)
    {
        Response.TrySkipIisCustomErrors = true;
        Response.StatusCode = 500;
    }

</script>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>500: Internal Server Error</title>
    <link href="/Areas/BridgeStreet/Assets/Vendor/bootstrap-3.3.6/css/bootstrap.min.css" rel="stylesheet">

    <style>

        .generic-error.generic-content-header {
            background-position: center center;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -ms-background-size: cover;
            -o-background-size: cover;
            background-size: cover;
            width: 100%;
            height: 395px;
            overflow: hidden
        }
        .error-content h1 {
            font-size: 40px;
            font-weight: 700;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.13;
            color: #024
        }
        .error-content p,
        .error-content p a {
            font-weight: 400;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.22;
            color: #024
        }
        .error-content p {
            font-size: 18px
        }
        .error-content p a {
            text-decoration: underline!important
        }

        .btn-blue {
            background-color: #002244;
            font-size: 12px;
            font-weight: bold;
            line-height: 1.5;
            text-align: center;
            color: white !important;
            float: left;
            padding: 15px 20px;
            border-radius: 4px;   
            cursor: pointer;         
        }

        .btn-o.btn-blue {
            background-color: transparent;
            color:#002244;
            border-color: #002244;
        }

        .no-touch .btn-blue:hover,
        .btn-blue:focus,
        .btn-blue:active,
        .btn-blue.active,
        .open > .dropdown-toggle.btn-blue {
            background-color: rgba(0, 34, 68, 0.85);
            font-size: 12px;
            font-weight: bold;
            line-height: 1.5;
            text-align: center;
            color: white !important;
        }

        .btn-blue:hover {
            background-color: rgba(0, 34, 68, 0.85);
            text-decoration: none;
        }

        .no-touch .btn-o.btn-blue:hover,
        .btn-o.btn-blue:focus,
        .btn-o.btn-blue:active,
        .btn-o.btn-blue.active,
        .open > .dropdown-toggle.btn-o.btn-blue {
            background-color: #1d82aa;
            color: #fff;
        }


    </style>

</head>
<body>    
    <div class="generic-content-module container-fluid">

        <div class="row">

            <div class="generic-content-header generic-error" style="background-image: url('/Areas/BridgeStreet/Assets/Local/Images/500.jpg');"></div>

            <div class="error-content container">
                <h1>Internal Server Error</h1>
                <p>Error code 500. We track these errors automatically, but if the problem persists feel free to <a href="/contact-us">contact us</a>. In the meantime, try <a href="/">refreshing</a>.</p>

                <a href="/contact-us" class="btn-blue">Contact Support</a>
            </div>

        </div>
        
    </div>    
</body>
</html>