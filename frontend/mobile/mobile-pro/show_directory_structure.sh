find . -type d | sed -e "s/[^-][^\/]*\//  /g" -e "s/^/    /" -e "s/-/|/"
