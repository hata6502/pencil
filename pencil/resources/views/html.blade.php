<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
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
