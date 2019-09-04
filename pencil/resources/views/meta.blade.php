<!-- htmllint preset="none" -->
@php $canonical = url()->full(); @endphp
<!-- htmllint preset="default" -->

<meta charset="utf-8" />
<title>@if(isset($title)){{ $title }} - @endif{{ config('app.name') }}</title>
@if(isset($description)) <meta name="description" content="{{ $description }}" /> @endif
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
@if(isset($robots)) <meta name="robots" content="{{ $robots }}" /> @endif

<link rel="manifest" href="{{ url('/manifest.json') }}" />

<meta name="twitter:card" content="{{ $twitter_card??'summary' }}" />
<meta name="twitter:site" content="@bluehood_admin" />
<meta property="og:url" content="{{ $canonical }}" />
<meta property="og:title" content="{{ $title??config('app.name') }}" />
@if(isset($description)) <meta property="og:description" content="{{ $description }}" /> @endif
<meta property="og:image" content="{{ $og_image??url('/images/wing.png') }}" />

<link rel="canonical" href="{{ $canonical }}" />
<link rel="icon" href="{{ url('/images/favicon@32px.png') }}" sizes="32x32" />
<link rel="icon" href="{{ url('/images/favicon@192px.png') }}" sizes="192x192" />
<link rel="icon" href="{{ url('/images/favicon@512px.png') }}" sizes="512x512" />
<link rel="apple-touch-icon" href="{{ url('/images/apple-touch-icon.png') }}" />
<meta name="theme-color" content="#ffffff" />
{{--<link rel="prev" href="前のページのURL" /> <link rel="next" href="次のページのURL" />--}}
