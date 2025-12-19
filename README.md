# rk.qcc: Quality Control Charts for RKWard

![Version](https://img.shields.io/badge/Version-0.0.1-blue.svg)
![License](https://img.shields.io/badge/License-GPL--3-green.svg)
![R Version](https://img.shields.io/badge/R-%3E%3D%203.0.0-lightgrey.svg)

**rk.qcc** is an RKWard plugin that provides a graphical interface for the **[`qcc`](https://cran.r-project.org/package=qcc)** package. It enables industrial engineers and data analysts to create standard Statistical Process Control (SPC) charts and perform Capability Analysis without writing R code.

## Features / Included Plugins

This package installs a new submenu in RKWard: **Analysis > Quality Control (qcc)**.

*   **Shewhart Charts (Continuous):**
    *   Create control charts for continuous variable measurements.
    *   **Types:** `xbar` (Mean), `R` (Range), `S` (Standard Deviation), and `xbar.one` (Individual measurements).
    *   **Input:** Supports both raw vectors (with a grouping variable) and pre-grouped matrices.

*   **Attribute Charts:**
    *   Create control charts for count data (defects or defectives).
    *   **Types:** `p` (Proportion), `np` (Count of defectives), `c` (Count of defects), `u` (Rate of defects per unit).
    *   **Sample Size:** Supports constant or variable sample sizes.

*   **Process Capability Analysis:**
    *   Analyze if a process meets engineering specifications (LSL/USL).
    *   **Output:** Histograms with specification lines and calculation of indices ($C_p$, $C_{pk}$, etc.).

## Requirements

1.  A working installation of **RKWard**.
2.  The R package **`qcc`**.
    ```R
    install.packages("qcc")
    ```
3.  The R package **`devtools`** (for installation from source).

## Installation

1.  Open R in RKWard.
2.  Run the following commands in the R console:

```R
local({
## Preparar
require(devtools)
## Computar
  install_github(
    repo="AlfCano/rk.qcc"
  )
## Imprimir el resultado
rk.header ("Resultados de Instalar desde git")
})
```
3.  Restart RKWard to ensure the new menu items appear correctly.

## Usage & Examples

To test these plugins, use the standard datasets included in the `qcc` library.

### Step 0: Prepare Data
Run this code in the RKWard console to load the library and data:

```R
library(qcc)
data(pistonrings) # Continuous data (diameter measurements)
data(orangejuice) # Attribute data (defective cartons)
```

### Example 1: X-bar Chart (Continuous)
Monitor the mean diameter of piston rings.

1.  Navigate to **Analysis > Quality Control (qcc) > Shewhart Charts (Continuous)**.
2.  **Data Variable:** Select `pistonrings$diameter`.
3.  **Grouping Variable:** Select `pistonrings$sample`.
4.  **Chart Type:** "xbar (Mean)".
5.  **Save QCC Object as:** `my_xbar` (We need this for Example 3).
6.  Click **Submit**.
    *   *Result:* A control chart showing sample means. Red points indicate samples outside the control limits (out of statistical control).

### Example 2: p-Chart (Attributes)
Monitor the proportion of defective juice cartons.

1.  Navigate to **Analysis > Quality Control (qcc) > Attribute Charts**.
2.  **Count Variable:** Select `orangejuice$D`.
3.  **Sample Size Source:** "Variable".
4.  **Sample Size Variable:** Select `orangejuice$size`.
5.  **Chart Type:** "p (Proportion)".
6.  Click **Submit**.
    *   *Result:* A p-chart with "stepped" control limits (reflecting the varying sample sizes).

### Example 3: Process Capability
Check if the piston ring process meets the engineering specs (73.99 - 74.01).

1.  Navigate to **Analysis > Quality Control (qcc) > Process Capability Analysis**.
2.  **Select QCC Object:** Choose `my_xbar` (created in Example 1).
3.  **Lower Spec Limit (LSL):** `73.99`.
4.  **Upper Spec Limit (USL):** `74.01`.
5.  **Target Value:** `74.00`.
6.  Click **Submit**.
    *   *Result:* A histogram overlaid with the theoretical normal distribution and specification lines. The summary text will display $C_p$ and $C_{pk}$ values.

## Author

**Alfonso Cano Robles**
*   Email: alfonso.cano@correo.buap.mx

Assisted by Gemini, a large language model from Google.
