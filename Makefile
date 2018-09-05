docs:
	git checkout -b gh-pages
	node build.js
	git add -f dist
	git commit -m "Publish docs"
	git push -f origin gh-pages
	git rm -q -r --cached dist
	git checkout -
	git branch -D gh-pages
