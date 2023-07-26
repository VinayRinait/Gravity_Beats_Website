document.getElementById("test1").innerHTML = userDetail
  .map(
    (user) =>
      `<div>
      <div>Name: ${user.name}</div>
      <div>Age: ${user.age}</div>
      <div>Place: ${user.place}</div>
      <div>Country: ${user.country}</div>
      <div>Avatar: ${user.avatar}</div>
    </div>`
  )
  .join("");
