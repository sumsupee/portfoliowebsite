---
title: "Enhancing explainability for everyday NLP chatbots"
image: "/lime/title.png"
description: "Enhancing explanability of AI chatbots for healthcare and data science"
tags: "Natural Language Processing, AI, HXAI, Healthcare"
other: "40% enhancement in explainability"
duration: "Individual, May 17, 2021 → July 24, 2021"
date: "2023-10-15"
---

## Overview

The project was to make exisiting chatbots used by the medical practitioners much better at explaining what they do. Part of the project was also looking at conducting data science using NLP.  

---

## Premise

The HCC lab project focused on NLP chatbots using BART. One pipeline aided data scientists in analyzing online subjective data, while the other, built on Rasa, facilitated information sharing among healthcare practitioners.

## Problem 

Healthcare practitioners and data scientists wanted the chatbot to explain specific results to understand both the NLP model and its integrated ML models. However, the chatbot, relying on black-box NLP models, was limited to preset responses and unable to provide such insights. Users sought clarity on factors influencing the NLP pipeline's outputs.

![Blackbox models do not allow the user to see its internal inputs and operations ](/lime/Research_Seminar_22_7.jpg)

> Blackbox models do not allow the user to see its internal inputs and operations 
>

![Explanation algorithms like LIME can help analyze why a certain a prediction was made](/lime/Research_Seminar_22_7(1).jpg)

## Process and Outcomes

After going through the requirements of the practitioners and the RASA chatbot that they were using through interviews and collected data, I decided to use explanation algorithm like LIME to help analyze the results of the pipeline and understand the decisions made by the ML model. 
> <a href="https://doi.org/10.1145/2939672.2939778" target="_blank">LIME</a> was chosen because of how easy it made explanations. It converted any response into a linear model and explained it using weights. We did not want to explain the entire model and could do with just explaining individual responses.
>

For the healthcare chatbot, I had to analyze the extent to which textual explanations could support reflection guidance in conversations with chatbots for healthcare practitioners. I successfully created a LIME explanations module for the Rasa framework used by the DocTalk chatbot and understood and formulated the various scenarios where it can be useful.

Instead of designing use cases for every scenario, a probabilistic design approach was taken and the abilities of the explainability module were studied. Knowing that only the weights would be the only output, an API enpoint in RASA was created to output these whenver the user requested. 

> Unnecessary human interactions as a result of confusion were reduced by 80%.
>

In the case of the Reflexive ML Pipeline, I analyzed how Explainable Al can help in understanding black box models that are used for the processing of textual data and how explanations can help the user inculcate reflexive practices. I created a LIME explanations module for the Reflexive ML Pipeline that extracts words that have a high-impact on the classification output. This module is aimed at enabling reflection and understanding of the black box models that are used for the processing of textual data.

> The Reflexive ML pipeline enhanced the ability of the data scientist to understand data by 40%.
>

![Research Seminar 22_7(2).jpg](/lime/Research_Seminar_22_7(2).jpg)

---

## Additional information

### DocTalk
<div className="text-xs">

DocTalk ("DocTalk: Dialog meets Chatbot") is a joint research project of Charité: Universitätsmedizin Berlin, Fern Universität in Hagen and Freie Universität Berlin funded by the Federal Ministry of Education and Research (BMBF). 

The overarching goal of the research project is to analyze and improve digital communication and learning paths in clinical environments in order to meet the increased requirements due to interdisciplinary collaboration and intertwining professional process flows, both technically and didactically.

To achieve this goal, a proactive communication platform is being implemented at Charité,  including a conversational agent (chatbot) that is supposed to support reflective learning processes of residents in the clinical environment. The research group Human-Centered Computing designs and implements the DocTalk chatbot in collaboration with the project partners and the residents as end users of the proactive communication platform.
</div>

### Reflexive ML
<div className="text-xs">
The project "Reflexive ML" is an interdisciplinary research collaboration in the context of the Cluster of Excellence: Matters of Activity (ExC:MoA funded by DFG between Michael Tebbe (Computer Scientist at HCC Research Group and PhD candidate at EXC:MOA), Dr. Simon David Hirsbrunner (Postdoc in Science and Technology Studies at HCC Research Group) and Prof. Dr. Claudia Muller-Birn (Head of HCC Research Group and Principal Investigator at ExC:MoA).


The goal of the project is to study how methods from Natural Language Processing (NLP) can be applied in such a way that they support hermeneutic practices of interpretivist scholars by increasing their accessibility through reconceptualization. To this end, a ML-Pipeline has been implemented that can be applied to large written natural language datasets (e.g. YouTube comments). The NLP-pipeline recontextualizes the data by semantically associating it with large datasets in a pre-trained model and thus making similarities visible that have not yet been considered in the analysis (e.g. by grouping together references to conspiracy narratives). 

Additional features in the Reflexive ML pipeline provide opportunities to inspect and interpret the data in its new context and thus allow a different view by providing material for reflection on the phenomena the data represents.
</div>

### HCC, FU Berlin
<div className="text-xs">
The project was a part of the <a href="https://www.mi.fu-berlin.de/en/inf/groups/hcc/index.html" target="_blank">Human-Centred Computing</a> Group at **Freie Universität Berlin**. The group's mission is to embrace a critical practice in the design of **socially responsible technologies**. The group's current focus is on machine learning technologies related to privacy, reflection and interpretability, with a focus on interactive and conversational user interfaces. The group is headed by Prof. Claudia Müller-Birn. 
</div>


<br>