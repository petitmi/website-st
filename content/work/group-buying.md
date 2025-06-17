---
title: "Data Science In E-commerce Platforms Driven By Supply Chain Optimization"
date: 2023-09-01
---
## Data Science In E-commerce Platforms Driven By Supply Chain Optimization

### 2023-09-01

As a novel online retail model, community group-buying transforms individuals' grocery habits, as well as the supply chain, logistics, and warehousing. This business model combines the Bulk Purchase Sorting with Pre-sale Model, allowing it to achieve wholesale prices, but customers don't need to purchase in wholesale quantities. The key factor to the success of this model lies in the optimization of the supply chain. A management and visualization system, constructed with various precise, efficient, and sophisticated data science techniques, makes this possible.

## Why do people change their daily grocery shopping habits?

During COVID lockdowns in China, people were stuck at home city by city for nearly three years. Personal grocery runs were banned, and only deliveries were allowed. But even those were limited, so a workaround emerged: bulk deliveries organized at the community level. That’s when community group-buying exploded in popularity, though it wasn’t exactly new.

Even after COVID, people kept using it, partly because of habit, partly common sense. It’s cheaper, efficient, and the system actually works.

There are two dominant features in community group-buying compared to the online retail model:  
- **Pre-sale with next-day delivery**  
- **Community pickup**  

Although this model is crucial during special situations like lockdown days, it also works well in normal daily life if the prices are low enough, and the items are diverse and of high quality.

## What is community group-buying?

Let's start with the giant Walmart. Walmart was founded in 1945, and it grew through chain stores and big box stores, eventually becoming an oligopoly in niche categories. Famous for its lowest prices, Walmart has succeeded in leveraging technology to transform its supply chain. On the demand side, what customers experience is a preference for coming to supermarkets like Walmart rather than convenience stores with higher prices. The reason behind this phenomenon is the automated equipment and systems introduced in multiple stages of the supply chain. This transformation has also resulted in numerous layoffs and career changes.

Community group-buying is a retail business model where customers are accustomed to doing groceries online and will be able to pick them up the next day thanks to the **effective and efficient supply chain**. On this online platform, users can select all kinds of items, especially fresh produce, for tomorrow's pickup.

Unlike the traditional big-box approach, products are not sorted and packaged for consumers all at once. Instead, they undergo distributed sorting through shared warehouses, central warehouses, grid warehouses, and community sites. Products are only categorized into individual portions once they reach the community sites. During the previous transportation processes, they are consolidated. Additionally, shipments and redistributions between different regions occur based on sales or demand predictions.

![process](/static/work/group-buying/process.jpg)

> The fulfillment process for community group-buying involves the transportation of primarily produced products from suppliers to nearby Shared Warehouses or Central Warehouses. Shared Warehouses function as hubs for Central Warehouses, which typically cover larger regions. Subsequently, the products are transported to Grid Warehouses strategically located in medium-sized areas. Finally, on the day of fulfillment, the products are delivered to Community Collection Points for customers to pick up.

In a nutshell, the community group buying model combines the **Bulk Purchase Sorting** with **Pre-sale Model**, allowing it to achieve **wholesale prices**, but customers don&#39;t need to purchase in **wholesale quantities**.

## Tasks and Data Science Solutions in Community Group-Buying

### 1. Sales Prediction

When it comes to sales prediction, strategies and goals vary depending on different factors.

**Total sales prediction** primarily impacts macro-level decision-making and is often reflected on data dashboards. In this context, extreme precision is less critical, and our focus should be on identifying trends and achieving accuracy at a larger scale.

Nevertheless, when dealing with sales predictions at **hierarchical regional and categorical levels**, the goal of accuracy becomes more crucial. This level of accuracy directly influences immediate decision-making and specific actions, and any decrease in accuracy can result in significant cost increases. Therefore, the sales prediction in both niche regions and categories is usually the most important in this section.

Additionally, sales prediction tasks involve considerations of **time periods and granularity**. Real-time and day-by-day forecasting is essential. For longer timeframes, such as week-to-week or month-to-month predictions, aggregating the day-by-day results can provide solutions.

Given the complexity of sales prediction and the multitude of factors influencing sales, different strategies are required for different aspects. To gain a broader perspective and account for numerous factors, we may turn to unexplainable models like deep learning models. Input features are derived from various aspects of user activities and the supply chain, as well as external factors like weather. We also heavily rely on correlation analysis, cluster analysis, and other explainably analytical methods to obtain features. Finally, once the structure of the prediction model is complete, we need to add time series analysis into it.

### 2. Purchase Optimization

This part is commonly used in various e-commerce analysis models. To attract more customers and enhance their purchasing experience, it is essential to conduct **user analysis**, **product analysis**, **marketing analysis**, and implement a **personalized recommendation pipeline**.

Understanding the **target customer base** and identifying **potential customers** is crucial. User segmentation based on factors such as occupation and consumption habits allows us to distinguish between existing customers and potential ones. Managing the user lifecycle can be achieved through the AARRR model, which stands for Acquisition, Activation, Retention, Referral, and Revenue. This model has been extensively researched and is a valuable tool. Additionally, specific sub-analyses like Traffic Source Analysis, Conversion Rate Analysis, and Repeat Purchase Analysis can be applied.

When it comes to implementing a personalized recommendation system, Machine Learning Methods for prediction and ranking, as well as [A/B Testing](/20221001-ab-testing/) for evaluation, have reached a high level of maturity.

### 3. Loss Management

This part is like doing accounting. We compare the ***initial quantity** and the **final quantity** at each stage and identify the factors contributing to significant losses. Once we have analyzed the results, we can employ additional management tools, such as real-time alerts, to intervene in the chain reaction caused by these losses.

Furthermore, it&#39;s crucial to proactively **forecast and manage risk**. Risks originate from both external and internal environments, such as weather, politics, and internal corruption, with varying degrees and impacts. During the COVID-19 pandemic, the highest risk factor was regional lockdowns, which could result in overstocking or excessive demand fluctuations.

Apart from these considerations, **route optimization**, including _geodata analysis_, and **inventory optimization**, including **dynamic programming**, should also be explored.

### 4. Quality Optimization

The community group-buying model offers lower prices and reasonable delivery times, which are its primary advantages. However, lower prices often coincide with lower product quality, which can deter regular customers.

To implement quality analysis, the first step is to establish an indicator that reflects the quality status. The most common indicator is the **refund rate**, which calculates the number of refunds for SKUs, orders, or users. Its caliber is 
\(\frac{\text{returned SKUs/orders/users}}{\text{sales/fulfillments on the fulfilling day}}\)
.

However, this indicator has a **latency** issue. Consider a scenario where you purchase a box of grapes, only to discover two days later that they are spoiled and need to be returned. Due to your schedule, it takes another day before you can return the item. This results in a three-day lag in the indicator. The indicator becomes accurate and stable only after the refund window has closed.

In this context, the second step involves **revising or predicting** this refund rate indicator to solve the latency issue. Initially, basic time series analysis can be employed for revision. However, as the business matures, more advanced machine learning and causal inference methods are required for prediction.

Basically, when predicting this indicator, we have already been engaged in the quality analysis. We analyzes **suppliers** and different **segments of the supply chain** to identify the key factors influencing product quality.

Of course, similar to predicting sales amounts, refund rates at hierarchical levels of **regions and product categories** must be considered differently. For example, a sudden decline in the quality of Shaanxi gala apples in Guangdong due to an unforeseen event may have a significant impact locally, but may not be reflected in the global caliber of the indicator.








