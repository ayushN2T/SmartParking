# 📄 Bhavnagar Smart Parking — Municipal Project Proposal & Architecture Whitepaper

## Executive Summary
Urban congestion in Bhavnagar has reached critical levels around high-density commercial corridors such as **MG Road, Vegetable Market, Station Road, and Kalanala Circle**. The primary driver of this congestion is not a complete absence of parking infrastructure, but rather a **severe lack of real-time visibility** into vacant slots and absence of coordinated routing.

**Bhavnagar Smart Parking** is a digital civic-tech platform designed in partnership with municipal guidelines to connect citizens, sensor telemetry, and municipal traffic enforcement into a single real-time grid.

---

## 1. Problem Landscape in Bhavnagar

### 1.1 Key Traffic Choke Points
1. **Bhavnagar Central Market & MG Road**: Narrow corridors choked by haphazard on-street two-wheeler and four-wheeler parking.
2. **Railway Station Junction**: High surge volumes during train arrivals and departures, resulting in double-parking on Station Road.
3. **Kalanala Administrative Circle**: Merchant and banking traffic competing for roadside curb space.
4. **Takhteshwar Temple**: Pilgrimage and evening tourist peaks causing weekend parking saturation.

### 1.2 Quantitative Impacts
* **Search Time**: 15–22 minutes per vehicle per trip during peak hours (11:00 AM – 03:00 PM).
* **Fuel Wastage**: Estimated 40,000+ liters of fuel wasted monthly by circling vehicles in Bhavnagar.
* **Economic Drag**: Retail store footfall drops by up to 25% when customers cannot find convenient parking.

---

## 2. Platform Architecture

```
+-------------------------------------------------------------------------+
|                        CITIZEN WEB / MOBILE APP                         |
|  React 19 • Plus Jakarta Sans & Inter • Responsive Civic Transit UI     |
+------------------------------------+------------------------------------+
                                     |  REST API Requests (JSON)
                                     v
+-------------------------------------------------------------------------+
|                         DDEV NGINX WEB SERVER                           |
|  PHP 8.4 REST API Endpoints:                                            |
|   - GET  /api/facilities.php   (Joined with distance matrix)            |
|   - GET  /api/destinations.php (Bhavnagar urban hubs)                   |
|   - POST /api/book.php         (Digital pass & QR generation)           |
|   - POST /api/simulate-tick.php(Curb telemetry sync & event logs)       |
+------------------------------------+------------------------------------+
                                     |  PDO Parameterized SQL
                                     v
+-------------------------------------------------------------------------+
|                        MARIADB 11.8 DATABASE                            |
|   - `destinations`       : 5 core urban zones                           |
|   - `parking_facilities` : 12 managed lots (Capacity, tariffs, status)  |
|   - `parking_distances`  : Distance & walk-time mapping                 |
|   - `digital_passes`     : RFID & QR check-in records                   |
|   - `sensor_telemetry`   : Live bay event logs                          |
+-------------------------------------------------------------------------+
```

---

## 3. Core Innovations

### 3.1 Dynamic AI Multi-Criteria Decision Algorithm
Rather than simply returning the closest parking lot (which could already be full or overpriced), the platform uses a weighted scoring model:
$$\text{Score} = (0.35 \times S_{\text{dist}}) + (0.30 \times S_{\text{space}}) + (0.15 \times S_{\text{price}}) + (0.10 \times S_{\text{walk}}) + (0.10 \times S_{\text{demand}})$$

* **Full Capacity Guardrail**: Any facility with 0 available spaces is automatically assigned a score of 0 and flagged as saturated.
* **Driver Balancing**: Drivers are directed to nearby under-utilized lots (e.g. diverting Central Market drivers to Gandhi Smriti Lot), easing congestion at the primary choke point.

### 3.2 FASTag Automated Boom Barrier Integration
* **RFID Clearance**: Vehicle registration numbers (`GJ-04-AB-1892`) are mapped to NETC FASTag wallets.
* **Auto-Lift**: Boom barrier lifts automatically without requiring the driver to stop for paper tokens or cash payments.
* **Contactless Deduction**: Approved BMC tariffs (₹10/hr for bikes, ₹15–₹20/hr for cars) are deducted upon exit.

### 3.3 Civic Command Dashboard for BMC Wardens
* Real-time capacity utilization across all 12 facilities.
* 24-hour hourly occupancy trajectory area chart.
* Urgent traffic diversion dispatch advisory triggered when lot saturation reaches 100%.

---

## 4. Financial Viability & ROI

| Revenue Stream | Projected Monthly Revenue (Bhavnagar Pilot) |
| :--- | :--- |
| Digital Booking Convenience Fee (₹3/booking on 15,000 bookings) | ₹45,000 |
| FASTag Toll Processing Commission (1.2% on municipal collections) | ₹68,000 |
| Commercial Merchant Sponsored Parking Validation | ₹35,000 |
| EV Charging Station Revenue Share | ₹22,000 |
| **Total Projected Monthly Revenue** | **₹1,70,000** |

* **Payback Period**: Estimated at **4.5 months** for initial sensor and barrier gate deployment.

---

## 5. Security & Compliance
* **SQL Injection Protection**: Strict PDO prepared statements for all database operations.
* **XSS Prevention**: React JSX auto-escaping and sanitized DOM structures.
* **Privacy Compliance**: Citizen vehicle numbers stored securely in compliance with the Digital Personal Data Protection (DPDP) Act of India.
