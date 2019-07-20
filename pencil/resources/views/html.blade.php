<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-106651880-4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-106651880-4');
    </script>

    @yield('meta')
    <link href="{{ mix('/css/app.css') }}" rel="stylesheet">
    @stack('styles')
  </head>
  <body>
    @yield('content')
    <script src="{{ mix('/js/app.js') }}"></script>
    @stack('scripts')
  </body>
</html>
