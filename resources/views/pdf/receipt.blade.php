@php
    $orderNumber = strtoupper(substr(str_replace('-', '', $order->id), 0, 8));
    $receiptDate = optional($order->created_at)->format('d F Y') ?: now()->format('d F Y');
    $unitPrice = (float) $order->price_per_night;
    $quantity = max(1, (int) $order->num_days);
    $discount = (float) ($order->discount_amount ?? 0);
    $total = (float) $order->total_amount;
    $subtotal = $unitPrice * $quantity;
    $paymentMethod = ucfirst($order->payment_method ?: 'Cash');
    $logoPath = public_path('logo-nav.png');
@endphp
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 34px 42px; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            color: #1f2b2a;
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.45;
        }
        .page { width: 100%; }
        .header {
            width: 100%;
            padding-bottom: 64px;
            border-bottom: 1px solid #e6e9e8;
        }
        .title {
            float: left;
        }
        .title h1 {
            margin: 0;
            color: #003f35;
            font-size: 34px;
            letter-spacing: 12px;
            line-height: 1;
        }
        .title p {
            margin: 10px 0 0;
            color: #8c8f92;
            font-size: 12px;
        }
        .logo {
            float: right;
            width: 125px;
            text-align: center;
        }
        .logo img {
            max-width: 118px;
            max-height: 56px;
        }
        .clear { clear: both; }
        .bar {
            margin-top: 28px;
            padding: 13px 20px;
            border-radius: 4px;
            background: #003f35;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .bar .left { float: left; }
        .bar .right { float: right; }
        .columns {
            width: 100%;
            margin-top: 30px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e6e9e8;
        }
        .column {
            float: left;
            width: 33.333%;
            padding-right: 24px;
        }
        .column h2 {
            margin: 0 0 16px;
            color: #003f35;
            font-size: 11px;
            letter-spacing: 4px;
        }
        .column p {
            margin: 0 0 6px;
            color: #5f6466;
        }
        .column strong {
            color: #252b2d;
            font-weight: 700;
        }
        .items {
            width: 100%;
            margin-top: 34px;
            border-collapse: collapse;
        }
        .items th {
            padding: 0 8px 13px;
            border-bottom: 2px solid #003f35;
            color: #003f35;
            font-size: 11px;
            letter-spacing: 3px;
            text-align: left;
        }
        .items td {
            padding: 13px 8px;
            border-bottom: 1px solid #e6e9e8;
            color: #333;
            font-size: 12px;
        }
        .items .right { text-align: right; }
        .summary {
            width: 270px;
            margin: 28px 0 0 auto;
            color: #565b5d;
        }
        .summary-row {
            padding: 9px 0;
            border-bottom: 1px solid #e6e9e8;
        }
        .summary-row span:first-child {
            display: inline-block;
            width: 145px;
            text-align: right;
        }
        .summary-row strong {
            display: inline-block;
            width: 115px;
            color: #2d3335;
            text-align: right;
        }
        .total-row {
            margin-top: 10px;
            padding: 13px 16px;
            border-radius: 4px;
            background: #003f35;
            color: #fff;
            font-weight: 700;
        }
        .total-row span {
            display: inline-block;
            width: 95px;
            font-size: 13px;
        }
        .total-row strong {
            display: inline-block;
            width: 130px;
            color: #fff;
            text-align: right;
            font-size: 13px;
        }
        .footer {
            margin-top: 44px;
            padding-top: 22px;
            border-top: 1px solid #e6e9e8;
            text-align: center;
        }
        .footer h2 {
            margin: 0;
            color: #003f35;
            font-size: 18px;
            letter-spacing: 8px;
        }
        .footer p {
            margin: 8px 0 0;
            color: #9a9da0;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="title">
                <h1>RECEIPT</h1>
                <p>Premium Airbnb &amp; Rental Properties</p>
            </div>
            <div class="logo">
                @if (file_exists($logoPath))
                    <img src="{{ $logoPath }}" alt="Logo">
                @else
                    Logo
                @endif
            </div>
            <div class="clear"></div>
        </div>

        <div class="bar">
            <div class="left">ORDER NO: {{ $orderNumber }}</div>
            <div class="right">DATE: {{ $receiptDate }}</div>
            <div class="clear"></div>
        </div>

        <div class="columns">
            <div class="column">
                <h2>COMPANY INFORMATION</h2>
                <p><strong>Pelek Properties</strong></p>
                <p>Nairobi, Kenya</p>
                <p>Phone: +254711614099</p>
                <p>Email: info@pelekproperties.com</p>
            </div>
            <div class="column">
                <h2>BILLED TO</h2>
                <p><strong>{{ $order->visitor_name }}</strong></p>
                <p>Phone: {{ $order->phone ?: '-' }}</p>
            </div>
            <div class="column">
                <h2>PAYMENT METHOD</h2>
                <p>□ {{ $paymentMethod }}</p>
            </div>
            <div class="clear"></div>
        </div>

        <table class="items">
            <thead>
                <tr>
                    <th style="width: 9%;">NO.</th>
                    <th>PRODUCT / SERVICE</th>
                    <th style="width: 22%;">QUANTITY</th>
                    <th class="right" style="width: 20%;">UNIT PRICE</th>
                    <th class="right" style="width: 18%;">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>{{ $order->property_title ?: 'Property booking' }}</td>
                    <td>{{ $quantity }} night(s)</td>
                    <td class="right">KES {{ number_format($unitPrice) }}</td>
                    <td class="right">KES {{ number_format($subtotal) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="summary">
            <div class="summary-row"><span>Subtotal</span><strong>KES {{ number_format($subtotal) }}</strong></div>
            <div class="summary-row"><span>Discount</span><strong>KES {{ number_format($discount) }}</strong></div>
            <div class="summary-row"><span>Tax</span><strong>KES 0</strong></div>
            <div class="total-row"><span>TOTAL</span><strong>KES {{ number_format($total) }}</strong></div>
        </div>

        <div class="footer">
            <h2>THANK YOU</h2>
            <p>Thank you for choosing Pelek Properties!</p>
        </div>
    </div>
</body>
</html>
