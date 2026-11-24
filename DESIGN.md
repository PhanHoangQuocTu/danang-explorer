# Coastal editorial guide

A traveller should be able to recognize a place name, compare practical details and reach the original map on a small phone. Give names and source prose room to wrap. Use clear, semibold display titles, a ruled index for discovery and compact controls for searching.

## Identity

The original mark combines two sails, a coral sun and a single wave on deep ocean. Use the square mark with its built-in clear space. Keep its proportions. Use an empty alt beside the written guide name and give standalone functional links an accessible name. The vector master is [icon.svg](src/app/icon.svg). The [512 px export](public/brand-mark.png) also supplies the social artwork.

## Tokens and type

The source of truth for color and sizing is [globals.css](src/styles/globals.css). Light uses paper `#F8F7F2`, ink `#1F2D33`, ocean headings `#123B4A` and teal actions `#0F6B70`. Dark uses `#0D242C`, `#EDF4F1`, `#DEF1EE` and `#9ADFD4` respectively. Sand and coral are accents. Status always has a text label.

Use the self-hosted Nunito variable font for Vietnamese and English headings, controls, and body text. Use tabular figures for counts and Geist Mono in chart tooltips. Page headings scale from 2.6 to 5 rem. Source prose uses relaxed leading and a reading measure around 68 characters. Base corner radius is 0.625 rem. Quiet rules separate repeated rows. Use larger section gaps than row gaps.

## Layout and interaction

Stack columns on phones. Use a shared page gutter. Let text wrap before shrinking or clipping it. Scroll wide data tables inside their own container. Preserve the same fields and destinations across grid, list and table. Keep Maps a separate action. Mobile navigation and filters must have accessible names, keyboard dismissal and visible focus. Directional motion is optional under reduced motion. Charts retain their readable data tables. Use server-rendered text and real links for indexable content.

## Photography and source material

Do not use generic travel photography as a listing image. Preserve sheet order, source language and optional-field semantics. Notes remain full length in both languages, including line breaks. See [product context](PRODUCT.md).
