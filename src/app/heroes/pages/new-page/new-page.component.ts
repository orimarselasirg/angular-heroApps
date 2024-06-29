import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heros.services';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_image: new FormControl(''),
  })

  public publisers = [
    {
      id: 'DC Comics',
      value: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      value: 'Marvel - Comics'
    },
  ]

  constructor(
    private heroService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog

  ){}

  ngOnInit(): void {
    if(!this.router.url.includes('edit')) return

    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.heroService.getHeroById(id)),
    ).subscribe(hero => {
      if( !hero ) return this.router.navigateByUrl('/')

      this.heroForm.reset(hero)
      return
    })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero
    return hero
  }


  onSubmit(): void {
    if(this.heroForm.invalid) return

    if ( this.currentHero.id) {
      this.heroService.updateHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackbar(`${hero.superhero} updated`)
      })
      return
    }
    this.heroService.addHero(this.currentHero)
    .subscribe( hero => {
      this.router.navigate(['/heores/edit', hero.id])
      this.showSnackbar(`${hero.superhero} created`)
    })

  }

  onDelecteHero(): void {
    if(!this.currentHero.id) throw Error('Hero ID is required')

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value
      })


      dialogRef.afterClosed()
      .pipe(
        filter((result: boolean )=> result),
        switchMap(() => this.heroService.deleteHeroById(this.currentHero.id)),
        filter((isDeleted: boolean) => isDeleted),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/heroes/list')
      })

      // dialogRef.afterClosed().subscribe(result => {
      //   if( !result ) return
      //   console.log({result});
      //   this.heroService.deleteHeroById(this.currentHero.id)
      //   .subscribe(isDeleted => {
      //     if(isDeleted) this.router.navigateByUrl('/heroes/list')
      //   })

      // })
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'ok',{
      duration: 3000
    })
  }

}
