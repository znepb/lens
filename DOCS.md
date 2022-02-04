# Lens API Documentation

Endpoint: `https://lens.znepb.me/api/`  
Latest API Version: `2.3`

## Objects

### PictureFull

**Structure**

```js
{
  id: int,
  filepath: string,
  place: string, // can be empty
  taken: string, // ISO date/time string
  location: Location,
  primaryTag: int, // This int represents the ID of a tag that will be contained in the Tags array.
  tags: Tag[]
  size: int,
  description: string, // can be empty
  width: int,
  height: int
}
```

**Example**  
Photo ID 14

```js
{
  id: 14,
  filepath: "85676a97-eb97-4c7d-a5df-93e8c6d3a274.jpeg",
  place: "Kings Island",
  taken: "2020-08-30T00:25:00.000Z",
  location: {
    id: 1,
    name: "Mason, Ohio",
    flag: "🇺🇸",
    cover: "85676a97-eb97-4c7d-a5df-93e8c6d3a274.jpeg"
  },
  primaryTag: 7,
  tags: [
    {
      id: 1,
      name: "Coasters",
      textColor: "#8fac52",
      backgroundColor: "#353d26",
      emoji: "🎢"
    },
    // ...
    {
      id: 7,
      name: "Sky",
      textColor: "#a3c9e1",
      backgroundColor: "#ffffff",
      emoji: "☁️"
    }
  ],
  size: 2267538,
  description: "This is my favorite photo I've taken, especially if you chop off the bottom half, and you just have Diamondback's turn and the top of the Eiffel Tower with the awesome cotton candy sky.",
  width: 2268,
  height: 4032
}
```

### PictureShort

Almost identical to PictureFull, but doesn't contain full location and tag information, as it is meant to be shown on a page with multiple pictures. Because of this, it would be more data-efficent to request the tags and location sepretely.

**Structure**

```js
{
  id: int,
  filepath: string,
  place: string, // can be empty
  taken: string, // ISO date/time string
  location: int,
  primaryTag: int,
  tags: int[],
  size: int,
  description: string, // can be empty
  width: int,
  height: int
}
```

**Example**

```js
{
  id: 115,
  filepath: "c1213c83-35aa-4262-9dbd-22c5d0c26ec5.jpg",
  place: "Cool Art",
  taken: "2021-12-29T20:27:00.000Z",
  location: 15,
  primaryTag: 5,
  tags: [2, 5],
  size: 5892171,
  description: "",
  width: 3024,
  height: 4032
}
```

### Location

**Structure**

```js
{
  id: int,
  name: string,
  flag: string, // flag emoji
  cover: string, // image path representing where the cover image is stored on the server
  pictures: int[]
}
```

**Example**

```js
{
  id: 13,
  name: "Orlando, Florida",
  flag: "🇺🇸",
  cover: "689eb0d0-f0a7-4d80-98bd-9fe1108772af.jpeg",
  pictures: [76, 77, 78, 79, ...]
}
```

### Tag

**Structure**

```js
{
  id: int,
  name: string,
  textColor: string,
  backgroundColor: string,
  emoji: string,
  pictures: int[]
}
```

**Example**

```js
{
  id: 3,
  name: "Night-time",
  textColor: "#3d6195",
  backgroundColor: "#24244e",
  emoji: "🌃",
  pictures: [12, 14, 20, 48, 49, ...]
}
```

## Endpoints

### `/api/images/[id]`

Returns a `FullPicture` object of the requested image `id`.

**Parameters**

- ID
  - The ID of the image.

**Response**  
See `FullPicture`.

### `/api/images/all`

Returns an array of images in the form of `PictureShort`.

**Query Paramters**

- orderBy
  - If set to `adminSort`, images will be sorted by their ID rather than by date.
- order
  - Whether to order ascending or descending. Note that `adminSort` is always forced to ascending. Value should be `asc` or `desc`. Default is descending, or newest first.
- skip
  - Integer of how many objects to skip. Default is 0.
- take
  - Integer of how many items to take from the database. Default is 100, maximum is also 100.

**Response**  
An array of `PictureShort` objects.

### `/api/images/random`

Fetches a random picture.

**Response**  
See `FullPicture`.

### `/api/locations/all`

Fetches all locations that exist.

**Response**  
An array of `Location` objects.

### `/api/locations/getMore`

Returns more images from the specified location `id`.

**Parameters**

- id
  - The ID of the location to fetch from.
- avoid
  - An ID to avoid while fetching the related images.
- take
  - The amount of images to take. Maximum is 5.

**Response**  
An array of `PictureShort` objects.

### `/api/tags/all`

Fetches all tags that exist.

**Response**  
An array of `Tag` objects.

### `/api/tags/getMore`

Identical to `/api/locations/getMore`, except for tags.

**Response**  
An array of `PictureShort` objects.
