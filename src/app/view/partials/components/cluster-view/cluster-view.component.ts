// Angular
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-cluster-view',
  templateUrl: './cluster-view.component.html'
})
export class ClusterViewComponent implements OnInit {

  // Holds data to view
  @Input() data: any;

  // Flog to show data info
  @Input() viewData: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
