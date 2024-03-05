  function autocomplete(inp) {
    var currentFocus;

    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.insertAdjacentElement('afterend', a);

        // Splitting the input value into keywords
    var val = this.value.trim();
    var keywords = val.split(' ')
                     .filter(keyword => keyword.trim() && keyword.toLowerCase() !== 'visa' && keyword.toLowerCase() !== 'visum' && keyword.toLowerCase() !== ' in ' && keyword.toLowerCase() !== ' of ' && keyword.toLowerCase() !== ' the ');
    var promises = keywords.map(keyword => fetch('autosearch.php?search=' + keyword).then(response => response.json()));

        Promise.all(promises).then(results => {
            var commonSuggestions = results.reduce((acc, curr, idx) => {
                if (idx === 0) {
                    return curr;
                } else {
                    return acc.filter(accItem => curr.some(currItem => currItem.label === accItem.label));
                }
            }, []);

    let counter = 0; // Initialize a counter
    commonSuggestions.forEach(suggestion => {
        if (counter < 12) { // Check if the counter is less than 12
            b = document.createElement("DIV");

                // Highlight the searched terms in bold
                var highlightedLabel = suggestion.label;
                keywords.forEach(keyword => {
                    var regex = new RegExp(keyword, "gi");
                    highlightedLabel = highlightedLabel.replace(regex, function(matched){
                        return "<b>" + matched + "</b>";
                    });
                });

                b.innerHTML = highlightedLabel + "<input type='hidden' value='" + suggestion.url + "'>";
                b.addEventListener("click", function(e) {
                    window.location.href = this.getElementsByTagName("input")[0].value;
                });
                a.appendChild(b);
            counter++; // Increment the counter
        }
    });
}).catch(error => console.error('Error:', error));
    });

  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

autocomplete(document.getElementById("myInput"));