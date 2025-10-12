let  str =`

<ul>
    <li>1111</li>
    <li>222</li>
    <li>3333</li>
</ul>
`


let reg = /<li>(?<content>.*)<\/li>/g

let iobj = str.matchAll(reg)

console.log(iobj)