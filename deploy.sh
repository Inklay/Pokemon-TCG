docker build --tag tcg_image .

docker container stop tcg

docker container rm tcg

docker container run -d --name "tcg"  tcg_image

docker logs tcg
