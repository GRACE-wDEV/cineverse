const input = document.querySelector("input")
const debounceText = document.getElementById('debounce')

const updateDebounceText = debounce((text)=>{
  debounceText.textContent=text;
})

input.addEventListener("keyup", (e)=>{
  updateDebounceText(e.target.value)
  if(e.key=="Enter")
    debounceText.textContent=e.target.value
})

function debounce(cb, delay=1000)
{
  let timeout
  return (...arg)=>{
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...arg);
    }, delay);
  }
}
