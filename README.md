# MapViz

Simple geo json visualiser. Built in Typescript and React. Uses Redux for state management.

## Build instructions

### Install Dependencies
`$ npm install`

### Lint
`$ npm run lint`

### Build
```$ npm run build```
Once you've built the application, you copy the files generated in `build/` to any static web server of your choice.

## Features
* Visualise ramps by construction material
* Visualise ramps by size (0-50, 50-200, 200-526 sq. meters)
* Zoom into map (contextual information - ramps relevant to current bounds will be shown)
* Filter by material and size categories
* Reset filter
* Map markers showing location of each ramp
* Markers are clickable - popup showing ramp address, longitude and latitude appears on click
