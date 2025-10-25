"use client";

import { useMemo, useState } from "react";

// Mock data for different time periods
const mockDataSets = {
  "1H": [
    // Recent 1 hour - high volatility, quick moves
    { time: 0, price: 0.001472, volume: 45.2 },
    { time: 1, price: 0.001468, volume: 42.1 },
    { time: 2, price: 0.001471, volume: 38.7 },
    { time: 3, price: 0.001469, volume: 41.3 },
    { time: 4, price: 0.001465, volume: 39.8 },
    { time: 5, price: 0.001467, volume: 44.2 },
    { time: 6, price: 0.001463, volume: 47.1 },
    { time: 7, price: 0.001461, volume: 43.9 },
    { time: 8, price: 0.001459, volume: 41.7 },
    { time: 9, price: 0.001456, volume: 38.4 },
    { time: 10, price: 0.001454, volume: 35.8 },
    { time: 11, price: 0.001451, volume: 33.2 },
    { time: 12, price: 0.001448, volume: 31.7 },
    { time: 13, price: 0.001445, volume: 29.4 },
    { time: 14, price: 0.001442, volume: 27.8 },
    { time: 15, price: 0.001439, volume: 26.1 },
    { time: 16, price: 0.001436, volume: 24.9 },
    { time: 17, price: 0.001433, volume: 23.7 },
    { time: 18, price: 0.00143, volume: 22.4 },
    { time: 19, price: 0.001427, volume: 21.8 },
    { time: 20, price: 0.001424, volume: 20.3 },
    { time: 21, price: 0.001421, volume: 19.7 },
    { time: 22, price: 0.001418, volume: 18.9 },
    { time: 23, price: 0.001415, volume: 17.8 },
    { time: 24, price: 0.001412, volume: 16.9 },
    { time: 25, price: 0.001409, volume: 15.7 },
    { time: 26, price: 0.001406, volume: 14.8 },
    { time: 27, price: 0.001403, volume: 13.9 },
    { time: 28, price: 0.0014, volume: 12.7 },
    { time: 29, price: 0.001397, volume: 11.8 },
    { time: 30, price: 0.001394, volume: 10.9 },
    { time: 31, price: 0.001391, volume: 9.8 },
    { time: 32, price: 0.001388, volume: 8.9 },
    { time: 33, price: 0.001385, volume: 7.7 },
    { time: 34, price: 0.001382, volume: 6.8 },
    { time: 35, price: 0.001379, volume: 5.9 },
    { time: 36, price: 0.001376, volume: 4.7 },
    { time: 37, price: 0.001373, volume: 3.8 },
    { time: 38, price: 0.00137, volume: 2.9 },
    { time: 39, price: 0.001367, volume: 1.7 },
    { time: 40, price: 0.001364, volume: 0.8 },
    { time: 41, price: 0.001361, volume: 12.3 },
    { time: 42, price: 0.001358, volume: 23.7 },
    { time: 43, price: 0.001355, volume: 34.8 },
    { time: 44, price: 0.001352, volume: 45.9 },
    { time: 45, price: 0.001349, volume: 56.7 },
    { time: 46, price: 0.001346, volume: 67.8 },
    { time: 47, price: 0.001343, volume: 78.9 },
    { time: 48, price: 0.00134, volume: 89.7 },
    { time: 49, price: 0.001337, volume: 100.8 },
    { time: 50, price: 0.001334, volume: 111.9 },
    { time: 51, price: 0.001331, volume: 122.7 },
    { time: 52, price: 0.001328, volume: 133.8 },
    { time: 53, price: 0.001325, volume: 144.9 },
    { time: 54, price: 0.001322, volume: 155.7 },
    { time: 55, price: 0.001319, volume: 166.8 },
    { time: 56, price: 0.001316, volume: 177.9 },
    { time: 57, price: 0.001313, volume: 188.7 },
    { time: 58, price: 0.00131, volume: 199.8 },
    { time: 59, price: 0.001307, volume: 210.9 },
  ],
  "4H": [
    // 4 hour view - medium volatility
    { time: 0, price: 0.0012, volume: 234.5 },
    { time: 1, price: 0.001205, volume: 245.7 },
    { time: 2, price: 0.001198, volume: 223.8 },
    { time: 3, price: 0.001192, volume: 212.4 },
    { time: 4, price: 0.001188, volume: 198.7 },
    { time: 5, price: 0.001185, volume: 187.3 },
    { time: 6, price: 0.001182, volume: 176.8 },
    { time: 7, price: 0.001179, volume: 165.4 },
    { time: 8, price: 0.001176, volume: 154.9 },
    { time: 9, price: 0.001173, volume: 143.7 },
    { time: 10, price: 0.00117, volume: 132.8 },
    { time: 11, price: 0.001167, volume: 121.4 },
    { time: 12, price: 0.001164, volume: 110.9 },
    { time: 13, price: 0.001161, volume: 99.7 },
    { time: 14, price: 0.001158, volume: 88.8 },
    { time: 15, price: 0.001155, volume: 77.4 },
    { time: 16, price: 0.001152, volume: 66.9 },
    { time: 17, price: 0.001149, volume: 55.7 },
    { time: 18, price: 0.001146, volume: 44.8 },
    { time: 19, price: 0.001143, volume: 33.4 },
    { time: 20, price: 0.00114, volume: 22.9 },
    { time: 21, price: 0.001137, volume: 11.7 },
    { time: 22, price: 0.001134, volume: 45.8 },
    { time: 23, price: 0.001131, volume: 89.4 },
    { time: 24, price: 0.001128, volume: 123.7 },
    { time: 25, price: 0.001125, volume: 167.8 },
    { time: 26, price: 0.001122, volume: 201.4 },
    { time: 27, price: 0.001119, volume: 245.9 },
    { time: 28, price: 0.001116, volume: 289.7 },
    { time: 29, price: 0.001113, volume: 323.8 },
    { time: 30, price: 0.00111, volume: 367.4 },
    { time: 31, price: 0.001107, volume: 401.9 },
    { time: 32, price: 0.001104, volume: 445.7 },
    { time: 33, price: 0.001101, volume: 489.8 },
    { time: 34, price: 0.001098, volume: 523.4 },
    { time: 35, price: 0.001095, volume: 567.9 },
    { time: 36, price: 0.001092, volume: 601.7 },
    { time: 37, price: 0.001089, volume: 645.8 },
    { time: 38, price: 0.001086, volume: 689.4 },
    { time: 39, price: 0.001083, volume: 723.9 },
    { time: 40, price: 0.00108, volume: 767.7 },
    { time: 41, price: 0.001077, volume: 801.8 },
    { time: 42, price: 0.001074, volume: 845.4 },
    { time: 43, price: 0.001071, volume: 889.9 },
    { time: 44, price: 0.001068, volume: 923.7 },
    { time: 45, price: 0.001065, volume: 967.8 },
    { time: 46, price: 0.001062, volume: 1001.4 },
    { time: 47, price: 0.001059, volume: 1045.9 },
    { time: 48, price: 0.001056, volume: 1089.7 },
    { time: 49, price: 0.001053, volume: 1123.8 },
    { time: 50, price: 0.00105, volume: 1167.4 },
    { time: 51, price: 0.001047, volume: 1201.9 },
    { time: 52, price: 0.001044, volume: 1245.7 },
    { time: 53, price: 0.001041, volume: 1289.8 },
    { time: 54, price: 0.001038, volume: 1323.4 },
    { time: 55, price: 0.001035, volume: 1367.9 },
    { time: 56, price: 0.001032, volume: 1401.7 },
    { time: 57, price: 0.001029, volume: 1445.8 },
    { time: 58, price: 0.001026, volume: 1489.4 },
    { time: 59, price: 0.001023, volume: 1523.9 },
  ],
  "1D": [
    // 1 day view - the pattern you described
    { time: 0, price: 0.0005, volume: 2.1 },
    { time: 1, price: 0.0005, volume: 1.8 },
    { time: 2, price: 0.0005, volume: 2.3 },
    { time: 3, price: 0.0005, volume: 1.9 },
    { time: 4, price: 0.0005, volume: 2.7 },
    { time: 5, price: 0.0005, volume: 3.1 },
    { time: 6, price: 0.0005, volume: 2.8 },
    { time: 7, price: 0.0005, volume: 2.2 },
    { time: 8, price: 0.0005, volume: 1.9 },
    { time: 9, price: 0.0005, volume: 2.4 },
    { time: 10, price: 0.0005, volume: 3.2 },
    { time: 11, price: 0.0005, volume: 2.9 },
    { time: 12, price: 0.0005, volume: 2.1 },
    { time: 13, price: 0.0005, volume: 1.8 },
    { time: 14, price: 0.0005, volume: 2.6 },
    { time: 15, price: 0.0005, volume: 3.4 },
    { time: 16, price: 0.0005, volume: 4.1 },
    { time: 17, price: 0.0005, volume: 3.8 },
    { time: 18, price: 0.0005, volume: 2.9 },
    { time: 19, price: 0.0005, volume: 2.3 },
    { time: 20, price: 0.0005, volume: 1.9 },
    { time: 21, price: 0.0005, volume: 2.1 },
    { time: 22, price: 0.0005, volume: 2.8 },
    { time: 23, price: 0.0005, volume: 3.2 },
    { time: 24, price: 0.0005, volume: 2.7 },
    { time: 25, price: 0.0005, volume: 2.4 },
    { time: 26, price: 0.0005, volume: 2.1 },
    { time: 27, price: 0.0005, volume: 1.8 },
    { time: 28, price: 0.0005, volume: 2.3 },
    { time: 29, price: 0.0005, volume: 2.9 },
    { time: 30, price: 0.0005, volume: 3.1 },

    // Sharp move up
    { time: 31, price: 0.0008, volume: 45.8 },
    { time: 32, price: 0.0008, volume: 46.2 },
    { time: 33, price: 0.0008, volume: 46.9 },
    { time: 34, price: 0.0008, volume: 47.4 },
    { time: 35, price: 0.0008, volume: 48.1 },
    { time: 36, price: 0.0008, volume: 48.8 },
    { time: 37, price: 0.0008, volume: 52.3 },
    { time: 38, price: 0.0008, volume: 49.7 },
    { time: 39, price: 0.0008, volume: 47.2 },
    { time: 40, price: 0.0008, volume: 45.8 },
    { time: 41, price: 0.0008, volume: 44.1 },
    { time: 42, price: 0.0008, volume: 42.4 },
    { time: 43, price: 0.0008, volume: 40.9 },
    { time: 44, price: 0.0008, volume: 39.2 },
    { time: 45, price: 0.0008, volume: 37.8 },
    { time: 46, price: 0.0008, volume: 36.1 },
    { time: 47, price: 0.0008, volume: 34.9 },
    { time: 48, price: 0.0008, volume: 33.7 },
    { time: 49, price: 0.0008, volume: 32.2 },
    { time: 50, price: 0.0008, volume: 30.3 },
    { time: 51, price: 0.0008, volume: 28.8 },
    { time: 52, price: 0.0008, volume: 27.7 },
    { time: 53, price: 0.0008, volume: 26.9 },
    { time: 54, price: 0.0008, volume: 25.4 },
    { time: 55, price: 0.0008, volume: 24.1 },
    { time: 56, price: 0.0008, volume: 22.8 },
    { time: 57, price: 0.0008, volume: 28.1 },
    { time: 58, price: 0.0008, volume: 32.4 },
    { time: 59, price: 0.0008, volume: 35.8 },
    { time: 60, price: 0.0008, volume: 38.4 },

    // Horizontal again
    { time: 61, price: 0.0008, volume: 41.1 },
    { time: 62, price: 0.0008, volume: 43.9 },
    { time: 63, price: 0.0008, volume: 46.4 },
    { time: 64, price: 0.0008, volume: 48.8 },
    { time: 65, price: 0.0008, volume: 51.9 },
    { time: 66, price: 0.0008, volume: 54.2 },
    { time: 67, price: 0.0008, volume: 57.1 },
    { time: 68, price: 0.0008, volume: 59.7 },
    { time: 69, price: 0.0008, volume: 62.3 },
    { time: 70, price: 0.0008, volume: 64.8 },
    { time: 71, price: 0.0008, volume: 67.2 },
    { time: 72, price: 0.0008, volume: 69.7 },
    { time: 73, price: 0.0008, volume: 72.1 },
    { time: 74, price: 0.0008, volume: 74.9 },
    { time: 75, price: 0.0008, volume: 77.4 },
    { time: 76, price: 0.0008, volume: 79.2 },
    { time: 77, price: 0.0008, volume: 68.3 },
    { time: 78, price: 0.0008, volume: 61.7 },
    { time: 79, price: 0.0008, volume: 58.2 },
    { time: 80, price: 0.0008, volume: 55.8 },
    { time: 81, price: 0.0008, volume: 53.1 },
    { time: 82, price: 0.0008, volume: 61.4 },
    { time: 83, price: 0.0008, volume: 68.7 },
    { time: 84, price: 0.0008, volume: 74.3 },
    { time: 85, price: 0.0008, volume: 79.9 },
    { time: 86, price: 0.0008, volume: 84.7 },
    { time: 87, price: 0.0008, volume: 89.1 },
    { time: 88, price: 0.0008, volume: 93.4 },
    { time: 89, price: 0.0008, volume: 97.2 },
    { time: 90, price: 0.0008, volume: 101.8 },

    // Sharp move down
    { time: 91, price: 0.0006, volume: 105.9 },
    { time: 92, price: 0.0006, volume: 109.7 },
    { time: 93, price: 0.0006, volume: 113.2 },
    { time: 94, price: 0.0006, volume: 116.8 },
    { time: 95, price: 0.0006, volume: 120.1 },
    { time: 96, price: 0.0006, volume: 123.4 },
    { time: 97, price: 0.0006, volume: 108.3 },
    { time: 98, price: 0.0006, volume: 97.7 },
    { time: 99, price: 0.0006, volume: 89.2 },
    { time: 100, price: 0.0006, volume: 82.8 },
    { time: 101, price: 0.0006, volume: 77.1 },
    { time: 102, price: 0.0006, volume: 89.4 },
    { time: 103, price: 0.0006, volume: 103.7 },
    { time: 104, price: 0.0006, volume: 118.3 },
    { time: 105, price: 0.0006, volume: 134.9 },
    { time: 106, price: 0.0006, volume: 152.7 },
    { time: 107, price: 0.0006, volume: 172.1 },
    { time: 108, price: 0.0006, volume: 193.4 },
    { time: 109, price: 0.0006, volume: 216.8 },
    { time: 110, price: 0.0006, volume: 242.1 },
    { time: 111, price: 0.0006, volume: 269.7 },
    { time: 112, price: 0.0006, volume: 299.2 },
    { time: 113, price: 0.0006, volume: 331.8 },
    { time: 114, price: 0.0006, volume: 367.1 },
    { time: 115, price: 0.0006, volume: 405.9 },
    { time: 116, price: 0.0006, volume: 448.2 },
    { time: 117, price: 0.0006, volume: 494.7 },
    { time: 118, price: 0.0006, volume: 545.8 },
    { time: 119, price: 0.0006, volume: 602.1 },
    { time: 120, price: 0.0006, volume: 664.3 },

    // Angular downward trend to end
    { time: 121, price: 0.00055, volume: 732.9 },
    { time: 122, price: 0.0005, volume: 808.7 },
    { time: 123, price: 0.00045, volume: 892.4 },
    { time: 124, price: 0.0004, volume: 985.1 },
    { time: 125, price: 0.00035, volume: 1087.8 },
    { time: 126, price: 0.0003, volume: 1201.2 },
    { time: 127, price: 0.00025, volume: 1326.9 },
    { time: 128, price: 0.0002, volume: 1465.7 },
    { time: 129, price: 0.00015, volume: 1618.4 },
    { time: 130, price: 0.0001, volume: 1786.2 },
  ],
  "1W": [
    // 1 week view - broader movements
    { time: 0, price: 0.000089, volume: 1234.5 },
    { time: 1, price: 0.000092, volume: 1456.7 },
    { time: 2, price: 0.000095, volume: 1678.9 },
    { time: 3, price: 0.000098, volume: 1890.1 },
    { time: 4, price: 0.000101, volume: 2012.3 },
    { time: 5, price: 0.000104, volume: 2234.5 },
    { time: 6, price: 0.000107, volume: 2456.7 },
    { time: 7, price: 0.00011, volume: 2678.9 },
    { time: 8, price: 0.000113, volume: 2890.1 },
    { time: 9, price: 0.000116, volume: 3012.3 },
    { time: 10, price: 0.000119, volume: 3234.5 },
    { time: 11, price: 0.000122, volume: 3456.7 },
    { time: 12, price: 0.000125, volume: 3678.9 },
    { time: 13, price: 0.000128, volume: 3890.1 },
    { time: 14, price: 0.000131, volume: 4012.3 },
    { time: 15, price: 0.000134, volume: 4234.5 },
    { time: 16, price: 0.000137, volume: 4456.7 },
    { time: 17, price: 0.00014, volume: 4678.9 },
    { time: 18, price: 0.000143, volume: 4890.1 },
    { time: 19, price: 0.000146, volume: 5012.3 },
    { time: 20, price: 0.000149, volume: 5234.5 },
    { time: 21, price: 0.000152, volume: 5456.7 },
    { time: 22, price: 0.000155, volume: 5678.9 },
    { time: 23, price: 0.000158, volume: 5890.1 },
    { time: 24, price: 0.000161, volume: 6012.3 },
    { time: 25, price: 0.000164, volume: 6234.5 },
    { time: 26, price: 0.000167, volume: 6456.7 },
    { time: 27, price: 0.00017, volume: 6678.9 },
    { time: 28, price: 0.000173, volume: 6890.1 },
    { time: 29, price: 0.000176, volume: 7012.3 },
    { time: 30, price: 0.000179, volume: 7234.5 },
    { time: 31, price: 0.000182, volume: 7456.7 },
    { time: 32, price: 0.000185, volume: 7678.9 },
    { time: 33, price: 0.000188, volume: 7890.1 },
    { time: 34, price: 0.000191, volume: 8012.3 },
    { time: 35, price: 0.000194, volume: 8234.5 },
    { time: 36, price: 0.000197, volume: 8456.7 },
    { time: 37, price: 0.0002, volume: 8678.9 },
    { time: 38, price: 0.000203, volume: 8890.1 },
    { time: 39, price: 0.000206, volume: 9012.3 },
    { time: 40, price: 0.000209, volume: 9234.5 },
    { time: 41, price: 0.000212, volume: 9456.7 },
    { time: 42, price: 0.000215, volume: 9678.9 },
    { time: 43, price: 0.000218, volume: 9890.1 },
    { time: 44, price: 0.000221, volume: 10012.3 },
    { time: 45, price: 0.000224, volume: 10234.5 },
    { time: 46, price: 0.000227, volume: 10456.7 },
    { time: 47, price: 0.00023, volume: 10678.9 },
    { time: 48, price: 0.000233, volume: 10890.1 },
    { time: 49, price: 0.000236, volume: 11012.3 },
    { time: 50, price: 0.000239, volume: 11234.5 },
    { time: 51, price: 0.000242, volume: 11456.7 },
    { time: 52, price: 0.000245, volume: 11678.9 },
    { time: 53, price: 0.000248, volume: 11890.1 },
    { time: 54, price: 0.000251, volume: 12012.3 },
    { time: 55, price: 0.000254, volume: 12234.5 },
    { time: 56, price: 0.000257, volume: 12456.7 },
    { time: 57, price: 0.00026, volume: 12678.9 },
    { time: 58, price: 0.000263, volume: 12890.1 },
    { time: 59, price: 0.000266, volume: 13012.3 },
  ],
  "1M": [
    // 1 month view - long term trend
    { time: 0, price: 0.000012, volume: 45678.9 },
    { time: 1, price: 0.000015, volume: 46789.1 },
    { time: 2, price: 0.000018, volume: 47890.3 },
    { time: 3, price: 0.000021, volume: 48901.5 },
    { time: 4, price: 0.000024, volume: 49012.7 },
    { time: 5, price: 0.000027, volume: 50123.9 },
    { time: 6, price: 0.00003, volume: 51234.1 },
    { time: 7, price: 0.000033, volume: 52345.3 },
    { time: 8, price: 0.000036, volume: 53456.5 },
    { time: 9, price: 0.000039, volume: 54567.7 },
    { time: 10, price: 0.000042, volume: 55678.9 },
    { time: 11, price: 0.000045, volume: 56789.1 },
    { time: 12, price: 0.000048, volume: 57890.3 },
    { time: 13, price: 0.000051, volume: 58901.5 },
    { time: 14, price: 0.000054, volume: 59012.7 },
    { time: 15, price: 0.000057, volume: 60123.9 },
    { time: 16, price: 0.00006, volume: 61234.1 },
    { time: 17, price: 0.000063, volume: 62345.3 },
    { time: 18, price: 0.000066, volume: 63456.5 },
    { time: 19, price: 0.000069, volume: 64567.7 },
    { time: 20, price: 0.000072, volume: 65678.9 },
    { time: 21, price: 0.000075, volume: 66789.1 },
    { time: 22, price: 0.000078, volume: 67890.3 },
    { time: 23, price: 0.000081, volume: 68901.5 },
    { time: 24, price: 0.000084, volume: 69012.7 },
    { time: 25, price: 0.000087, volume: 70123.9 },
    { time: 26, price: 0.00009, volume: 71234.1 },
    { time: 27, price: 0.000093, volume: 72345.3 },
    { time: 28, price: 0.000096, volume: 73456.5 },
    { time: 29, price: 0.000099, volume: 74567.7 },
  ],
};

export function PriceChart() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<keyof typeof mockDataSets>("1D");

  const formatPrice = (value: number) => {
    return value.toFixed(6);
  };

  const currentData = mockDataSets[selectedPeriod];
  const currentPrice = currentData[currentData.length - 1].price;
  const startPrice = currentData[0].price;
  const priceChange = ((currentPrice - startPrice) / startPrice) * 100;
  const isPositive = priceChange > 0;

  // Calculate chart dimensions and scaling
  const chartWidth = 800;
  const chartHeight = 320;
  const padding = { top: 20, right: 20, bottom: 20, left: 80 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate price range
  const prices = currentData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Create path data for sharp, angular lines
  const { pathData, areaPathData } = useMemo(() => {
    let pathData = "";
    let areaPathData = "";

    currentData.forEach((point, index) => {
      const x = (index / (currentData.length - 1)) * innerWidth;
      const y =
        innerHeight - ((point.price - minPrice) / priceRange) * innerHeight;

      if (index === 0) {
        pathData = `M ${x} ${y}`;
        areaPathData = `M ${x} ${innerHeight} L ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
        areaPathData += ` L ${x} ${y}`;
      }
    });

    // Close the area path
    areaPathData += ` L ${innerWidth} ${innerHeight} Z`;

    return { pathData, areaPathData };
  }, [currentData, innerWidth, innerHeight, minPrice, priceRange]);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 5;
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      const value = minPrice + (priceRange * i) / tickCount;
      const y = innerHeight - (i / tickCount) * innerHeight;
      ticks.push({ value, y });
    }
    return ticks;
  }, [minPrice, priceRange, innerHeight]);

  return (
    <div className="space-y-4">
      {/* Price Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-white font-mono">
            ${formatPrice(currentPrice)}
          </div>
          <div
            className={`text-sm flex items-center gap-1 ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            <span>{isPositive ? "↗" : "↘"}</span>
            <span>
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
            <span className="text-white/40">24h</span>
          </div>
        </div>

        {/* Time period selector */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {(["1H", "4H", "1D", "1W", "1M"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                selectedPeriod === period
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full relative bg-[#151515] border border-white/10 rounded-xl p-4">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isPositive ? "#10B981" : "#EF4444"}
                stopOpacity={0.1}
              />
              <stop
                offset="100%"
                stopColor={isPositive ? "#10B981" : "#EF4444"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          {/* Chart area */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid lines */}
            {yTicks.map((tick, index) => (
              <line
                key={index}
                x1={0}
                y1={tick.y}
                x2={innerWidth}
                y2={tick.y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
            ))}

            {/* Reference line for starting price */}
            <line
              x1={0}
              y1={
                innerHeight -
                ((startPrice - minPrice) / priceRange) * innerHeight
              }
              x2={innerWidth}
              y2={
                innerHeight -
                ((startPrice - minPrice) / priceRange) * innerHeight
              }
              stroke="#374151"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />

            {/* Area fill */}
            <path d={areaPathData} fill="url(#priceGradient)" stroke="none" />

            {/* Sharp price line */}
            <path
              d={pathData}
              fill="none"
              stroke={isPositive ? "#10B981" : "#EF4444"}
              strokeWidth={2}
              strokeLinecap="square"
              strokeLinejoin="miter"
            />

            {/* Y-axis labels */}
            {yTicks.map((tick, index) => (
              <text
                key={index}
                x={-10}
                y={tick.y + 4}
                fill="#6B7280"
                fontSize={11}
                textAnchor="end"
                fontFamily="monospace"
              >
                {formatPrice(tick.value)}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* Volume indicator */}
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>Volume: $105K</span>
        <span>Market Cap: $19K</span>
      </div>
    </div>
  );
}
