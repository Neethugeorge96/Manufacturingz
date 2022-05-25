import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-release-to-production-container',
  templateUrl: './release-to-production-container.component.html'
})
export class ReleaseToProductionContainerComponent implements OnInit {

  @Input() productionOrderId;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.productionOrderId = Number(this.route.snapshot.paramMap.get('id'));

  }

  materialIssue(){
    this.router.navigate(['material-issue-production-order'], { relativeTo: this.route });
  }

  routing(){
    this.router.navigate(['routing-start-end'], { relativeTo: this.route });
  }

  timeSheet(){
    this.router.navigate(['time-sheet-updation'], { relativeTo: this.route });
  }

  production(){
    this.router.navigate(['production-closing'], { relativeTo: this.route });
  }

}
