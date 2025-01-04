import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../review/entities/review.entity';
import { Repository } from 'typeorm';
import { Seeder } from 'nestjs-seeder';
import { UsersService } from '../users/users.service';
import { TravelService } from '../travel/travel.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewSeeder implements Seeder{
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private userService: UsersService,
    private travelService: TravelService,
  ) {}

  async seed() {
    const user = await this.userService.findByEmail('fabricio@example.com');
    const userReviewed = await this.userService.findByEmail('franco@example.com');
    const travels = await this.travelService.findAll();
    const travel = travels[0];

    if (!user || !travel) {
      console.error('Required User or Travel not found for seeding.');
      return;
    }

    const reviews = [
      "The trip was amazing! Everything was perfectly organized.",
      "Breathtaking views, but the accommodation could be better.",
      "A once-in-a-lifetime experience! Highly recommend it.",
      "The tour guide was very knowledgeable and friendly.",
      "Loved every moment of it! Can't wait to book another trip.",
      "It was decent, but I expected more activities to be included."
    ];

    const userReviews = [
      "Very helpful and friendly throughout the trip.",
      "Always punctual and easy to communicate with.",
      "Went above and beyond to ensure everything was perfect.",
      "Great travel companion, very respectful and kind.",
      "Brought a lot of positive energy to the group!",
      "A bit quiet, but overall a reliable and pleasant person."
    ];
    
  
    
    for(let i =0; i < reviews.length; i++ ){
      const travelRandom = travels[Math.floor(Math.random() * travels.length)]
      const randomUser = await this.randomUser()

      const travelReview = this.reviewRepository.create({
        stars: await this.randonNumber(),
        content: reviews[i],
        createdUserBy: randomUser,
        travel: travelRandom,
        type: 'TRAVEL',
      });
      console.log(randomUser.name)
      const saveReview = await this.reviewRepository.save(travelReview);

      travelRandom.reviews = travelRandom.reviews || []
      travelRandom.reviews.push(saveReview)
      randomUser.reviewsCreated = randomUser.reviewsCreated || []
      randomUser.reviewsCreated.push(travelReview)
      await this.travelService.save(travelRandom)
      await this.userService.save(randomUser)

    }

    for(let i=0; i < userReviews.length; i++){
      const randomUserCreated = await this.randomUser()
      const randomUserRecived = await this.randomRecivedUser(randomUserCreated)

      const userReview = this.reviewRepository.create({
        stars: await this.randonNumber(),
        content: userReviews[i],
        createdUserBy: randomUserCreated,
        receivedUserBy: randomUserRecived,
        travel: travel,
        type: 'USER',
      })

      randomUserRecived.reviewsReceived = randomUserRecived.reviewsReceived || []
      randomUserRecived.reviewsReceived.push(userReview)
  
      randomUserCreated.reviewsCreated = randomUserCreated.reviewsCreated || []
      randomUserCreated.reviewsCreated.push(userReview)
      
      await this.userService.save(randomUserCreated)
      await this.userService.save(randomUserRecived)
      await this.reviewRepository.save(userReview);

    }

    /*
    const userReview = this.reviewRepository.create({
      stars: '5',
      content: 'very good travel companion',
      createdUserBy: user,
      receivedUserBy: userReviewed,
      travel: travel,
      type: 'USER',
    })

    
    userReviewed.reviewsReceived = userReviewed.reviewsReceived || []
    userReviewed.reviewsReceived.push(userReview)

    user.reviewsCreated = user.reviewsCreated || []
    user.reviewsCreated.push(userReview)

    await this.userService.save(user)
    await this.userService.save(userReviewed)
    await this.reviewRepository.save(userReview);
    */
  }

  async drop() {
    await this.reviewRepository.delete({});
  }

  async randonNumber():Promise<string>{
    const numeroAleatorio = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    return numeroAleatorio.toString();
  }

  async randomUser():Promise<User>{
    const users = await this.userService.findAll();
    return users[Math.floor(Math.random() * users.length)]
  }

  async randomRecivedUser(user:User):Promise<User>{
    let recivedUser = await this.randomUser();
    while(recivedUser.id === user.id){
      recivedUser = await this.randomUser();
    }
    return recivedUser;
  }
}
