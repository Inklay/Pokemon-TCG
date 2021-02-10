docker build --tag tcg_image .

docker container stop tcg

docker container rm tcg

docker container run -d --name "tcg"  tcg_image -v $HOME/Pokemon-TCG/data:/app/data

docker logs tcg
