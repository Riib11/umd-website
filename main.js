var sidebar = document.getElementsByClassName("sidebar")[0];
var content = document.getElementsByClassName("content")[0];
var content_items = content.getElementsByClassName("items")[0];
var search_input = document.getElementsByClassName("search-input")[0];

var items_data = [];

/*
  search
*/

function parse_query(query) {
  let terms = [];
  let tags = [];
  query.split(" ").forEach(s => {
    if (s.startsWith("#"))
      tags.push(s.slice(1));
    else
      terms.push(s);
  });
  console.log(query, terms, tags);
  return {
    terms: terms,
    tags: tags
  };
}

function update_search() {
  let query = search_input.value.toLowerCase();
  let query_data = parse_query(query);

  items_data.forEach(item => {
    if (query_data.terms.every(term =>
          item.title.toLowerCase().includes(term.toLowerCase())) &&
       (query_data.tags.length == 0 ||
          query_data.tags.some(tag_q =>
            item.tags.some(tag_i => tag_i.toLowerCase().startsWith(tag_q.toLowerCase())))))
    {
      item.element.classList.remove("item-hidden");
    }
    else
      item.element.classList.add("item-hidden");
  });
}

function set_search(query) {
  search_input.value = query;
  update_search();
}

search_input.oninput = () => update_search();


/*
  items
*/

function create_item(data) {
  let item = document.createElement("div");
  item.classList.add("item");

  let buffer = document.createElement("div");
  buffer.classList.add("buffer");
  item.appendChild(buffer);

  let a = document.createElement("a");
  a.href = data.href;
  a.classList.add("item-a");
  buffer.appendChild(a);

  let title = document.createElement("div");
  title.classList.add("item-title");
  title.innerHTML = data.title;
  a.appendChild(title);

  let tags = document.createElement("div");
  tags.classList.add("item-tags");
  buffer.appendChild(tags);
  data.tags.forEach(tag_text => {
    let tag = document.createElement("div");
    tag.classList.add("item-tag");
    tag.innerHTML = "#"+tag_text;
    tag.onclick = () => set_search("#"+tag_text);
    tags.appendChild(tag);
  });

  let desc = document.createElement("div");
  desc.classList.add("item-description");
  desc.innerHTML = data.desc;
  buffer.appendChild(desc);

  let date = document.createElement("div");
  date.classList.add("item-date");
  date.innerHTML = data.date;
  buffer.appendChild(date);

  items_data.push({
    element: item,
    title: data.title,
    tags: data.tags
  });

  return item;
}

/*
  mobile
*/

var mobile_classes = [];

function set_mobile(value) {
  mobile_classes.forEach(mobile_elements => {
    for (let i = 0; i < mobile_elements.length; i ++) {
      let e = mobile_elements[i];
      if (value) e.classList.add("mobile");
      else e.classList.remove("mobile");
    }
  });
}

function update_mobile() {
  console.log(window.innerWidth, window.innerWidth < 500 ? "mobile" : null);
  if (window.innerWidth < 500)
    set_mobile(true);
  else
    set_mobile(false);
}

window.onresize = (event) => {
  update_mobile();
};

/*
  onload
*/

window.onload = (event) => {
  projects.forEach(data => {
    let item = create_item(data);
    content_items.appendChild(item);
  });

  mobile_classes = mobile_classes.concat([
    document.getElementsByTagName("body"),
    document.getElementsByTagName("main"),
    document.getElementsByClassName("sidebar"),
    document.getElementsByClassName("title"),
    document.getElementsByClassName("description"),
    document.getElementsByClassName("account-description"),
    document.getElementsByClassName("content"),
    document.getElementsByClassName("search"),
    document.getElementsByClassName("search-input"),
    document.getElementsByClassName("search-clear"),
    document.getElementsByClassName("item-title"),
    document.getElementsByClassName("item-tag"),
    document.getElementsByClassName("item-description")
  ]);

  update_mobile();
}
